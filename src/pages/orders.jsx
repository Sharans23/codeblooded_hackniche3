import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and shipments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
          <CardDescription>This page is under construction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              Orders functionality coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
