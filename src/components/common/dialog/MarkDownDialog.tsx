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

function MarkDownDialog() {
  const [content, setContent] = useState<string | undefined>("");
  return (
    <Dialog>
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
            >
              Cancle
            </Button>
            <Button
              type="submit"
              variant={"ghost"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
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
