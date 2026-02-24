"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/kits/card";
import { Field } from "@/components/kits/field";
import { Input } from "@/components/kits/input";
import { Button } from "@/components/kits/button";

export function SimpleForm<T extends z.ZodTypeAny>({ schema, fields, submitText, onSubmit }: {
  schema: T;
  fields: Array<{ name: string; label: string; type?: string; placeholder?: string }>;
  submitText: string;
  onSubmit: (data: z.infer<T>) => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<T>>({ resolver: zodResolver(schema) });

  return (
    <Card className="w-full space-y-4">
      {fields.map((field) => (
        <Field key={field.name} label={field.label}>
          <Input type={field.type ?? "text"} placeholder={field.placeholder} {...register(field.name as never)} />
          {errors[field.name as keyof typeof errors] && <p className="text-xs text-red-300">{String(errors[field.name as keyof typeof errors]?.message)}</p>}
        </Field>
      ))}
      <Button disabled={isSubmitting} onClick={handleSubmit(onSubmit)} className="w-full">{submitText}</Button>
    </Card>
  );
}
