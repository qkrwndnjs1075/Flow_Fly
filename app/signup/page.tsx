"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-context";
import { Mail, Lock, User, Check, ArrowRight } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signup, verifyEmail } = useAuth();

  // 이메일 인증 관련 상태
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // 비밀번호 유효성 검사
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // 비밀번호 유효성 검사 함수
  useEffect(() => {
    setPasswordValid({
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationEmail = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email);

      if (result.success) {
        setIsEmailSent(true);
        setCountdown(180); // 3분 타이머
        setError("");

        // 개발 환경에서만 코드 자동 설정
        if (result.verificationCode) {
          setVerificationCode(result.verificationCode);
          setUserInputCode(result.verificationCode);
        }
      } else {
        setError(result.message || "이메일 인증 코드 발송에 실패했습니다.");
      }
    } catch (err: any) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 확인 함수
  const verifyCode = () => {
    if (userInputCode === verificationCode) {
      setIsVerified(true);
      setVerificationError("");
    } else {
      setVerificationError("인증 코드가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (!isVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!passwordValid.length || !passwordValid.hasNumber || !passwordValid.hasSpecial) {
      setError("비밀번호 요구사항을 충족해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // verificationCode를 회원가입 함수에 전달
      const success = await signup(name, email, password, verificationCode);
      if (success) {
        router.push("/");
      } else {
        setError("계정 생성에 실패했습니다");
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 타이머 포맷팅 함수
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">회원가입</h1>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
              <button
                type="button"
                onClick={sendVerificationEmail}
                disabled={isLoading || countdown > 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "전송 중..." : countdown > 0 ? formatTime(countdown) : "인증 보내기"}
              </button>
            </div>
          </div>

          {isEmailSent && (
            <div className="animate-slide-in-up bg-white/5 p-4 rounded-lg border border-white/10">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-white mb-1">
                인증 코드
              </label>
              <div className="relative">
                <input
                  id="verificationCode"
                  type="text"
                  value={userInputCode}
                  onChange={(e) => setUserInputCode(e.target.value)}
                  className={`w-full bg-white/10 border ${
                    verificationError ? "border-red-500" : "border-white/20"
                  } rounded-md pl-4 pr-10 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="6자리 인증 코드 입력"
                  maxLength={6}
                  disabled={isVerified}
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  disabled={userInputCode.length < 6 || isVerified}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  확인
                </button>
                {isVerified && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
              </div>
              {verificationError && <p className="text-red-400 text-xs mt-1">{verificationError}</p>}
              {isVerified && <p className="text-green-400 text-xs mt-1">이메일이 성공적으로 인증되었습니다.</p>}
              {countdown > 0 && !isVerified && (
                <p className="text-white/70 text-xs mt-1">인증 코드 유효 시간: {formatTime(countdown)}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="mt-1 grid grid-cols-3 gap-1">
              <div className={`text-xs ${passwordValid.length ? "text-green-400" : "text-white/50"}`}>
                <Check className={`inline h-3 w-3 mr-1 ${passwordValid.length ? "text-green-400" : "text-white/50"}`} />
                8자 이상
              </div>
              <div className={`text-xs ${passwordValid.hasNumber ? "text-green-400" : "text-white/50"}`}>
                <Check
                  className={`inline h-3 w-3 mr-1 ${passwordValid.hasNumber ? "text-green-400" : "text-white/50"}`}
                />
                숫자 포함
              </div>
              <div className={`text-xs ${passwordValid.hasSpecial ? "text-green-400" : "text-white/50"}`}>
                <Check
                  className={`inline h-3 w-3 mr-1 ${passwordValid.hasSpecial ? "text-green-400" : "text-white/50"}`}
                />
                특수문자 포함
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-white/10 border ${
                  confirmPassword && password !== confirmPassword ? "border-red-500" : "border-white/20"
                } rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && password === confirmPassword && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !isVerified ||
              password !== confirmPassword ||
              !passwordValid.length ||
              !passwordValid.hasNumber ||
              !passwordValid.hasSpecial
            }
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors font-medium disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? "계정 생성 중..." : "계정 생성"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-white">
          <p>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-blue-300 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
