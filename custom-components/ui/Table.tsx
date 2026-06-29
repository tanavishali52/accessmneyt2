import { cn } from "@/lib/utils";
import { SkeletonTable } from "./Skeleton";
import { Paragraph } from "./Typography";

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found.",
  rowKey,
  onRowClick,
  className,
}: TableProps<T>) {
  const align = { left: "text-left", center: "text-center", right: "text-right" };

  if (loading) return <SkeletonTable rows={5} cols={columns.length} />;

  return (
    <div className={cn("w-full overflow-x-auto border border-slate-200 rounded-xl", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 font-semibold text-slate-600 whitespace-nowrap",
                  align[col.align ?? "left"]
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <Paragraph variant="muted">{emptyMessage}</Paragraph>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row, i) : i}
                className={cn(
                  "border-b border-slate-100 last:border-0 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-slate-50"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3.5 text-slate-700", align[col.align ?? "left"])}
                  >
                    {col.render
                      ? col.render(row, i)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
