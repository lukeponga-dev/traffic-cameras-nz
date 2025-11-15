
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import {
  AlertCircle,
  Flag,
  Gauge,
  Loader2,
  MapPin,
  MessageSquare,
} from "lucide-react";

import { submitReport, type State } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "./ui/input";
import type { Camera } from "@/lib/traffic-api";

const reportFormSchema = z.object({
  cameraId: z.string().optional(),
  reportType: z.enum(
    ["incorrect_speed_limit", "incorrect_location", "other"],
    {
      required_error: "Please select a report type.",
    }
  ),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not be longer than 500 characters.",
    }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      Submit Report
    </Button>
  );
};

interface ReportDialogProps {
  onOpenChange?: (open: boolean) => void;
  selectedCamera: Camera | null;
  userLocation: { latitude: number | null, longitude: number | null };
}

export function ReportDialog({ onOpenChange, selectedCamera, userLocation }: ReportDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState<State, FormData>(submitReport, {
    status: "idle",
    message: "",
  });

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      cameraId: selectedCamera?.id || "",
      description: "",
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Report Submitted",
        description: state.message,
      });
      setOpen(false);
      form.reset();
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast, form]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
    if(!isOpen) {
        form.reset();
    }
  };
  
  useEffect(() => {
    form.setValue('cameraId', selectedCamera?.id || "N/A");
    if (userLocation.latitude && userLocation.longitude) {
      form.setValue('latitude', userLocation.latitude);
      form.setValue('longitude', userLocation.longitude);
    }
  }, [selectedCamera, userLocation, form, open]);


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label={selectedCamera ? `Report an issue with ${selectedCamera.name}`: "Report a data issue"}>
          <Flag className="mr-2 h-4 w-4" aria-hidden="true" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Report a Data Issue</DialogTitle>
          <DialogDescription>
            Help us improve our data. If you've noticed an error, please let us know.
            {selectedCamera && ` You are reporting an issue for camera: ${selectedCamera.name}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="cameraId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Issue</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="incorrect_speed_limit">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4" aria-hidden="true" /> Incorrect Speed Limit
                        </div>
                      </SelectItem>
                      <SelectItem value="incorrect_location">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" aria-hidden="true" /> Incorrect Location
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" /> Other Issue
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                     <MessageSquare className="w-4 h-4" aria-hidden="true" /> Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about the issue..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
              <SubmitButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
