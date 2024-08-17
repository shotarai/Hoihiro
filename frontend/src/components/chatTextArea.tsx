"use client";

import { Textarea, TextareaProps } from "@chakra-ui/react";

export const ChatTextarea = (props: TextareaProps) => {
  return (
    <Textarea
      name="message"
      placeholder={"Type a message..."}
      maxHeight="200px"
      paddingStart="9"
      paddingEnd="9"
      resize="none"
      rows={2}
      backgroundColor="#f5f7f7"
      {...props}
      _placeholder={{ color: "fg.subtle" }}
      onInput={(event) => {
        const textarea = event.currentTarget;
        textarea.style.height = "auto";
        const borderHeight = textarea.offsetHeight - textarea.clientHeight;
        textarea.style.height = textarea.scrollHeight + borderHeight + "px";
        props.onInput?.(event);
      }}
    />
  );
};
