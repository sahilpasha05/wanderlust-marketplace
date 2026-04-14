import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Clock, User as UserIcon } from "lucide-react";

interface ActivityLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: any;
  created_at: string;
}

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
    // Poll for new logs every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching logs:", error);
        // This might fail if the table doesn't exist yet
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_id?.includes(searchTerm)
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-700";
      case "update":
        return "bg-blue-100 text-blue-700";
      case "delete":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "user":
        return "👤";
      case "listing":
        return "🏠";
      case "booking":
        return "📅";
      case "review":
        return "⭐";
      default:
        return "📌";
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading activity logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Input
          placeholder="Search by action, entity, or admin ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <Card
              key={log.id}
              className="p-4 rounded-xl border-0 bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getEntityIcon(log.entity_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-foreground bg-primary/10 px-2 py-1 rounded-md">
                      {log.entity_type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="bg-secondary rounded p-2 mt-2">
                      <p className="text-xs font-mono text-muted-foreground">
                        {JSON.stringify(log.changes, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filteredLogs.length} of {logs.length} events (latest 100)
      </div>
    </div>
  );
};

export default AdminActivityLogs;
