# file 업로드 적용

## 파일 추가

- /src/components/editor/addbutton.tsx

```tsx
"use client";
import { uploadFile } from "@/actions/todo-storage-actions";
import { getImageUrl } from "@/utils/storage-utils";
import { Editor } from "@tiptap/react";

interface AddPhotoProps {
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export default function AddPhoto({ editor, onImageUpload }: AddPhotoProps) {
  const handleUploadPhoto = async (files: FileList | null) => {
    if (files === null || !editor) return;

    const file = files[0];

    if (onImageUpload) {
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        editor.commands.setImage({ src: imageUrl });
      }
    } else {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(formData);
      const IMG_URL = getImageUrl(result?.path ?? "");
      editor.commands.setImage({ src: IMG_URL });
    }
  };

  return (
    <button
      type="button"
      className="relative w-8 h-8 cursor-pointer opacity-70 hover:opacity-40"
    >
      <input
        type="file"
        className="absolute top-0 left-0 w-8 h-8 outline-none opacity-0 file:cursor-pointer"
        accept="image/*"
        onChange={(e) => {
          handleUploadPhoto(e.target.files);
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 -960 960 960"
      >
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm480-480v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM240-280h480L570-480 450-320l-90-120-120 160Zm-40-480v560-560Z" />
      </svg>
    </button>
  );
}
```

- /src/app/acions/blog-storage-action.ts

```ts
"use server";

import { createServerSideClient } from "@/lib/supabase/server";

// 에러 타입에 대해서 파악하기
function handleError(error: unknown) {
  if (error) {
    console.error(error);
    throw error;
  }
}

// 파일 업로드
export async function uploadFile(formData: FormData): Promise<{
  id: string;
  path: string;
  fullPath: string;
} | null> {
  try {
    const supabase = await createServerSideClient();

    // getUser()를 사용하여 인증된 사용자 정보 가져오기
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase.auth.getUser();

    // if (userError || !user) {
    //   console.error("인증된 사용자가 아닙니다.");
    //   return null;
    // }

    const file = formData.get("file") as File;

    // 파일 이름에 사용자 ID를 포함시켜 고유성 보장
    const fileExt = file.name.split(".").pop();
    // const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const fileName = `${"test"}_${Date.now()}.${fileExt}`;

    // upsert : insert 와 update 를 동시에 처리할 수 있는 옵션
    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BLOG_BUCKET as string)
      .upload(fileName, file, { upsert: true });

    if (error) {
      handleError(error);
      return null; // 에러 발생 시 null 반환
    }

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// 파일 검색
export async function searchFiles(search: string = "") {
  const supabase = await createServerSideClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
    .list("", { search });

  if (error) {
    handleError(error);
    return null; // 에러 발생 시 null 반환
  }

  return data;
}
// 파일 삭제
export async function deleteFile(fileName: string) {
  const supabase = await createServerSideClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
    .remove([fileName]);

  handleError(error);

  return data;
}
```

- /src/utils/storage-utils.ts

```ts
export function getImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_STORAGE_BLOG_BUCKET}/${path}`;
}
```

## 파일 수정

- /src/app/components/editor/toolbar.tsx

```tsx
{
  /* 두번째 줄 */
}
<div className="flex justify-between gap-2 p-2">
  <div className="flex items-center gap-2">
    <Icon.Left editor={editor} />
    <Icon.Center editor={editor} />
    <Icon.Right editor={editor} />
    <Icon.TextColor editor={editor} />
    <Icon.BackgroundColor editor={editor} />
  </div>
  <div className="flex items-center gap-2">
    <Icon.Quote editor={editor} />
    <Icon.Code editor={editor} />
    <Icon.Link editor={editor} />
    {/* <Icon.AddPhoto editor={editor} /> */}
    {/* 만들어둔 파일 업로드 함수도 전달 */}
    <AddPhoto editor={editor} onImageUpload={onImageUpload} />
  </div>
</div>;
```
