# Create

## 실습 1.

- shadcn/ui Toast 컴포넌트 배치
- https://ui.shadcn.com/docs/components/toast 제거됨
- https://ui.shadcn.com/docs/components/sonner 사용

```bash
npx shadcn@latest add sonner
```

## 실습 2. Toast 적용하기

- /src/app/layout.tsx에 적용

```tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import SideNavigation from "@/components/common/SideNavigation";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Todo",
  description: "Todo Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${roboto.variable} antialiased`}>
        <SideNavigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## 실습 3. Toast 출력시키기

- src\components\common\dialog\MarkDownDialog.tsx

```tsx
const onSubmit = () => {
  console.log("자료 등록");
  if (!title || !content) {
    toast.error("입력 항목을 확인해주세요", {
      description: "제목과 내용을 입력해주세요.",
      duration: 3000,
    });
    return;
  }
  toast.success("성공했습니다", {
    description: "Superbase에 글이 등록되었습니다.",
    duration: 3000,
  });
  toast.error("실패했습니다");
};
```

## 실습 4. Superbase 연동하기 - actions 생성

- /src/app/actions 폴더 생성
- /src/app/actions/todos-action.ts 파일 생성

```ts
"use server";
import { createServerSideClient } from "@/lib/supabase/server";
import { Database } from "@/types/types_db";

export type TodosRow = Database["public"]["Tables"]["todos"]["Row"];
export type TodosRowInsert = Database["public"]["Tables"]["todos"]["Insert"];
export type TodosRowUpdate = Database["public"]["Tables"]["todos"]["Update"];

// 자료 create 기능
export async function createTodo(todos: TodosRowInsert) {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("todos")
    .insert([{ title: todos.title, content: todos.content }])
    .select()
    .single();
  return { data, error, status };
}
```

## 실습 5. 서버 액션

```tsx
const onSubmit = async () => {
  console.log("자료 등록");
  if (!title || !content) {
    toast.error("입력 항목을 확인해주세요", {
      description: "제목과 내용을 입력해주세요.",
      duration: 3000,
    });
    return;
  }
  // 서버 액션 실행하기
  const { data, error, status } = await createTodo({
    title,
    content,
  });
  if (error) {
    toast.error("등록 실패", {
      description: `Error ${error.message}`,
      duration: 3000,
    });
    return;
  }
  toast.success("성공했습니다", {
    description: "Superbase에 글이 등록되었습니다.",
    duration: 3000,
  });
};
```

## 6. UI 수정(창 닫기)
