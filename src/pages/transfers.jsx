import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Transfers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
        <p className="text-muted-foreground">
          Manage inventory transfers between warehouses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfers Management</CardTitle>
          <CardDescription>This page is under construction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              Transfers functionality coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
