"use client";
import FlowEdit from "@/components/Flow/FlowEdit";
import { H2 } from "@/components/typography";
import { useAuth } from "@/hooks/useAuth";
import { InitialForm } from "./comps";
import { FormValues } from "./types";
import { FormikProvider, useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Section } from "@/components/layout";
import { useSearchParams } from "next/navigation";
import { getCourse } from "@/lib/services/courseServices";
import { QKeys } from "@/types";
import { useState } from "react";
import { GenCourseResponse } from "@/requests/types";
import { toast } from "sonner";

const CourseEditScreen = () => {
  const id = useSearchParams().get("id") as string;
  const { user } = useAuth();
  const [streamMessage, setStreamMessage] = useState("");

  const { data } = useQuery({
    queryKey: [QKeys.COURSE, id],
    queryFn: () => getCourse(id),
    enabled: !!id,
  });

  const defaultValues = {
    uxId: "",
    initial: {
      learningGoal: "",
      currentKnowledge: "",
    },
    details: {
      courseDescription: "",
      tags: [],
      courseTitle: {
        value: "",
        override: undefined,
      },
      completionHours: {
        value: 0,
        override: undefined,
      },
      difficultyLevel: {
        value: "",
        override: undefined,
      },
    },
    modules: { roadmap: [], edges: [] },
  } as FormValues;

  const formik = useFormik({
    initialValues: data ? data : defaultValues,
    enableReinitialize: !!id,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  const { handleSubmit, setFieldValue, values } = formik;

  const { mutateAsync } = useMutation({
    mutationFn: async (values: FormValues) => {
      setStreamMessage("Validating course");

      const response = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate module");
      }

      const reader = response.body.getReader();
      let result = null;

      try {
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);
              if (data.error) {
                toast.error(data.message || "Invalid input", {
                  richColors: true,
                });
                return null;
              }
              if (data.message) setStreamMessage(data.message);
              if (data.result) result = data.result;
            } catch (e) {}
          }
        }

        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer);
            if (data.error) {
              toast.error(data.message || "Invalid input", {
                richColors: true,
              });
              return null;
            }
            if (data.message) setStreamMessage(data.message);
            if (data.result) result = data.result;
          } catch (e) {}
        }
      } finally {
        reader.releaseLock();
      }

      return result;
    },
    onSuccess: (data: GenCourseResponse | null) => {
      if (!data) return;
      const currentDetails = values.details;
      const newDetails = data.details;

      const mergedDetails = {
        ...newDetails,
        courseTitle: {
          value: newDetails.courseTitle.value,
          override: currentDetails.courseTitle.override,
        },
        completionHours: {
          value: newDetails.completionHours.value,
          override: currentDetails.completionHours.override,
        },
        difficultyLevel: {
          value: newDetails.difficultyLevel.value,
          override: currentDetails.difficultyLevel.override,
        },
      };

      setFieldValue("details", mergedDetails);
      setFieldValue("modules", data.modules);
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <H2 className="mb-6">{id ? "Edit Course" : "New Course"}</H2>
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <InitialForm streamMessage={streamMessage} />
        </form>
        {!!values.modules.roadmap.length && (
          <>
            <div className="mt-4" />
            <Section
              title="Your Learning Roadmap"
              description="This interactive learning roadmap shows your personalized course structure. Required modules are shown in white, optional modules in gray. You can zoom, pan, and click on modules to explore the details."
            >
              <FlowEdit
                edges={values.modules.edges}
                initialNodes={values.modules.roadmap.map((el) => ({
                  ...el,
                  lessons: [],
                  chat: [],
                }))}
                showLessonsProgress={false}
              />
            </Section>
          </>
        )}
      </FormikProvider>
    </div>
  );
};

export default CourseEditScreen;
