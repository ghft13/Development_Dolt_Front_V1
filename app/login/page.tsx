"use client";

import type React from "react"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/db-types";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    role: undefined as UserRole | undefined,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  
const Backend_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_DEVELOPMENT_DEPLOYED_BACKEND_URL
  : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  if (!formData.role) {
    setError("Please select your role");
    setIsLoading(false);
    return;
  }

  try {
    const response = await axios.post(
      `${Backend_URL}/api/auth/login`,
      {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
      { withCredentials: true }
    );

    if (response.data?.user && response.data?.token) {
      login({
        user: response.data.user,
        token: response.data.token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      router.push("/dashboard");
    } else {
      setError("Invalid email, password, or role");
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "An error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};



    const handleRoleChange = (value: string) => {
      setFormData((prev) => ({
        ...prev,
        role: value as UserRole,
      }));
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 border">
            <Image
              src="/images/logo/D_Black.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back to DOLT</h1>
          <p className="text-gray-600">Smart maintenance solutions</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                  <div className="grid gap-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    value={formData.role ?? ""}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        Property Owner/Manager
                      </SelectItem>
                      <SelectItem value="provider">
                        Service Provider/Technician
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked: boolean) =>
                        setFormData((prev) => ({ ...prev, rememberMe: !!checked }))
                      }
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
