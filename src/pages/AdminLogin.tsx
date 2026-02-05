import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Shield, Smartphone, QrCode, Copy, Check } from "lucide-react";
import type { AuthMFAEnrollResponse } from "@supabase/supabase-js";

type LoginStep = "credentials" | "mfa-verify" | "mfa-setup";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<LoginStep>("credentials");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .single();

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        throw new Error("У вас немає прав адміністратора");
      }

      // Check MFA status
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (totpFactor) {
        // User has MFA enabled, need to verify
        setFactorId(totpFactor.id);
        setStep("mfa-verify");
      } else {
        // User doesn't have MFA, prompt to set up
        await setupMFA();
      }
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Flugart Admin TOTP",
      });

      if (error) throw error;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setStep("mfa-setup");
    } catch (error: any) {
      toast({
        title: "Помилка налаштування 2FA",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const verifyAndEnrollMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!factorId) throw new Error("Factor ID not found");

      // Challenge the factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      // Verify with the code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: totpCode,
      });

      if (verifyError) throw verifyError;

      toast({ title: "2FA успішно налаштовано!" });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Помилка верифікації",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!factorId) throw new Error("Factor ID not found");

      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: totpCode,
      });

      if (verifyError) throw verifyError;

      toast({ title: "Успішний вхід" });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Невірний код",
        description: "Перевірте код та спробуйте знову",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render credentials form
  if (step === "credentials") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050d18] via-[#0a1628] to-[#0d1d35] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#0a1628]/80 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-cyan-400" />
              Адмін-панель
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-10 bg-[#050d18] border-cyan-500/30 text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-[#050d18] border-cyan-500/30 text-white"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Вхід..." : "Увійти"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render MFA setup form
  if (step === "mfa-setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050d18] via-[#0a1628] to-[#0d1d35] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#0a1628]/80 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Налаштування 2FA
            </CardTitle>
            <CardDescription className="text-slate-400">
              Для безпеки адмін-панелі потрібна двофакторна автентифікація
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                <Smartphone className="w-4 h-4" />
                Відскануйте QR-код у Google Authenticator
              </div>
              
              {qrCode && (
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              {secret && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Або введіть код вручну:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-slate-800 px-3 py-2 rounded text-sm text-cyan-400 font-mono">
                      {secret}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copySecret}
                      className="h-8 w-8"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={verifyAndEnrollMFA} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totp" className="text-slate-300">
                  Введіть 6-значний код з додатку
                </Label>
                <Input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest bg-[#050d18] border-cyan-500/30 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                disabled={loading || totpCode.length !== 6}
              >
                {loading ? "Перевірка..." : "Підтвердити та увійти"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render MFA verify form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d18] via-[#0a1628] to-[#0d1d35] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0a1628]/80 border-cyan-500/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            Двофакторна автентифікація
          </CardTitle>
          <CardDescription className="text-slate-400">
            Введіть код з Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={verifyMFA} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totp-verify" className="text-slate-300">
                6-значний код
              </Label>
              <Input
                id="totp-verify"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest bg-[#050d18] border-cyan-500/30 text-white"
                autoFocus
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              disabled={loading || totpCode.length !== 6}
            >
              {loading ? "Перевірка..." : "Підтвердити"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-400 hover:text-white"
              onClick={() => {
                setStep("credentials");
                setTotpCode("");
                supabase.auth.signOut();
              }}
            >
              Назад до входу
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
