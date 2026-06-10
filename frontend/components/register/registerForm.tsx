"use client";
import { getCsrfToken } from "@/lib/getCsrf";
import Input from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NETWORK_ERROR, SERVER_ERROR } from "@/constants/error";

const formSchema = z.object({
  name: z.string().min(1, "ユーザー名は必須です"),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードは必須です"),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: FormValues): Promise<void> => {
    setError("");
    try {
      const token = await getCsrfToken();
      if (!token) {
        setError(NETWORK_ERROR);
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        setError(SERVER_ERROR);
        console.error(`Failed to fetch todo: ${res.status}`);
        console.error(await res.json());
        return;
      }
      router.refresh();
      router.push("/member/todo");
    } catch (e) {
      setError(NETWORK_ERROR);
      console.error("Register request failed", e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <p>ユーサー名:</p>

        <Input type="text" placeholder="Enter title..." {...register("name")} />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <p>email:</p>

        <Input
          type="text"
          placeholder="Enter title..."
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <p>password:</p>

        <Input
          type="text"
          placeholder="Enter title..."
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};
export default RegisterForm;
