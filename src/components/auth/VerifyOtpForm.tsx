"use client";

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VerifyOtpForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("¡Correo verificado!", { description: data.message });
      } else {
        toast.error("Error", { description: data.error || "Código incorrecto" });
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo verificar el código" });
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6 max-w-sm mx-auto" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">Correo electrónico</label>
        <Input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Código de verificación</label>
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          containerClassName="justify-center"
          disabled={isLoading}
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6 || !email}>
        {isLoading ? "Verificando..." : "Verificar correo"}
      </Button>
    </form>
  );
} 