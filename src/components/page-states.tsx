import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "./shared";
export function PageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      className="flex flex-col gap-6 p-6"
    >
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
export class PageErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>This page couldn’t be displayed</AlertTitle>
            <AlertDescription>
              Your demo data has not been sent anywhere. Try again or reload to
              reset the workspace.
            </AlertDescription>
          </Alert>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => this.setState({ failed: false })}
          >
            Try again
          </Button>
        </div>
      );
    return this.props.children;
  }
}
