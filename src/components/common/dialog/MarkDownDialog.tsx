"use client";
// scss
import styles from "@/components/common/dialog/MarkDownDialog.module.scss";
// markdown
import MDEditor from "@uiw/react-md-editor";
// shadcn
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createTodo } from "@/app/actions/todos-action";

function MarkDownDialog() {
  const [open, setOpen] = useState<boolean>(false);

  const [content, setContent] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");

  // todo  wkrtjd
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
    setOpen(false);
    setTitle("");
    setContent("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
          className="font-normal text-gray-400 hover:text-gray-500
        cursor-pointer"
        >
          Add Contents
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-fit min-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog_titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder="Write title for your board"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.dialog_titleBox_title}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog_calendalBox}>
            <LabelCalendar label="From" required={false} />
            <LabelCalendar label="To" required={false} />
          </div>
          <Separator />
          {/* 마크다운 입력 영역 */}
          <div className={styles.dialog_markdown}>
            <MDEditor height={"100%"} value={content} onChange={setContent} />
          </div>
          <DialogDescription>Add Todos Description</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className={styles.dialog_buttonBox}>
            <Button
              variant={"ghost"}
              className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              onClick={() => setOpen(false)}
            >
              Cancle
            </Button>
            <Button
              type="submit"
              variant={"ghost"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MarkDownDialog;
