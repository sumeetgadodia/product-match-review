import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  MOCK_GROUPS,
  MAPPING_TYPE_LABEL,
  MAPPING_TYPE_INSTRUCTION,
  type MappingGroup,
  type MappingType,
  type MatchStatus,
} from "@/lib/mapping-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Product Mapping Review Console" },
      {
        name: "description",
        content:
          "Internal console to review product mappings: colour, variant, mini me and twinning matches.",
      },
    ],
  }),
  component: ReviewConsole,
});

type StatusFilter = "pending" | "accepted" | "rejected" | "all";
type TypeFilter = "all" | MappingType;

function ReviewConsole() {
  const [groups, setGroups] = useState<MappingGroup[]>(MOCK_GROUPS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [index, setIndex] = useState(0);

  const filteredGroups = useMemo(
    () =>
      groups.filter(
        (g) => typeFilter === "all" || g.mainProduct.mapping_type === typeFilter,
      ),
    [groups, typeFilter],
  );

  const safeIndex = Math.min(index, Math.max(filteredGroups.length - 1, 0));
  const group = filteredGroups[safeIndex];

  // Snapshot the set of match IDs visible under the current filter so that
  // accepting/rejecting a card does not immediately remove it from view.
  // The snapshot is rebuilt whenever the user changes filter, navigates to
  // another product, or refreshes.
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const groupId = group?.mainProduct.product_id;
  const lastKeyRef = useRef<string>("");
  useEffect(() => {
    const key = `${groupId ?? ""}|${statusFilter}|${typeFilter}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    if (!group) {
      setVisibleIds(new Set());
      return;
    }
    const ids = group.matches
      .filter((m) => (statusFilter === "all" ? true : m.status === statusFilter))
      .map((m) => m.product_id);
    setVisibleIds(new Set(ids));
  }, [group, groupId, statusFilter, typeFilter]);

  const visibleMatches = useMemo(() => {
    if (!group) return [];
    return group.matches.filter((m) => visibleIds.has(m.product_id));
  }, [group, visibleIds]);

  const counts = useMemo(() => {
    const base = { pending: 0, accepted: 0, rejected: 0, total: 0 };
    if (!group) return base;
    for (const m of group.matches) {
      base[m.status] += 1;
      base.total += 1;
    }
    return base;
  }, [group]);

  const updateStatus = (matchId: string, status: MatchStatus) => {
    if (!group) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.mainProduct.product_id === group.mainProduct.product_id
          ? {
              ...g,
              matches: g.matches.map((m) =>
                m.product_id === matchId ? { ...m, status } : m,
              ),
            }
          : g,
      ),
    );
    toast.success("Decision saved");
  };

  const bulkUpdate = (status: MatchStatus) => {
    if (!group) return;
    const ids = new Set(visibleMatches.map((m) => m.product_id));
    setGroups((prev) =>
      prev.map((g) =>
        g.mainProduct.product_id === group.mainProduct.product_id
          ? {
              ...g,
              matches: g.matches.map((m) =>
                ids.has(m.product_id) ? { ...m, status } : m,
              ),
            }
          : g,
      ),
    );
    toast.success(
      `${ids.size} match${ids.size === 1 ? "" : "es"} marked ${status}`,
    );
  };

  const refreshList = () => {
    if (!group) return;
    const ids = group.matches
      .filter((m) => (statusFilter === "all" ? true : m.status === statusFilter))
      .map((m) => m.product_id);
    setVisibleIds(new Set(ids));
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setIndex((i) => Math.min(filteredGroups.length - 1, i + 1));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">
              Product Mapping Review Console
            </h1>
            <p className="text-sm text-muted-foreground">
              Review pending product matches across mapping types.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v as TypeFilter);
                setIndex(0);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mapping type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="colour_mapping">Colour Mapping</SelectItem>
                <SelectItem value="variant">Variant</SelectItem>
                <SelectItem value="mini_me">Mini Me</SelectItem>
                <SelectItem value="twinning">Twinning</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-md border bg-background p-0.5">
              {(["pending", "accepted", "rejected", "all"] as StatusFilter[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded px-3 py-1.5 text-sm capitalize transition-colors ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {!group ? (
          <Card className="p-12 text-center text-muted-foreground">
            No products match the selected filters.
          </Card>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  Product{" "}
                  <span className="font-medium text-foreground">
                    {safeIndex + 1}
                  </span>{" "}
                  of {filteredGroups.length}
                </span>
                <span>•</span>
                <span>{MAPPING_TYPE_LABEL[group.mainProduct.mapping_type]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goPrev}
                  disabled={safeIndex === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goNext}
                  disabled={safeIndex >= filteredGroups.length - 1}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
              <div className="lg:sticky lg:top-6">
                <MainProductCard group={group} />
              </div>
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                    <h2 className="font-medium">
                      Matched products ({counts.total})
                    </h2>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      Pending{" "}
                      <span className="font-medium text-foreground">
                        {counts.pending}
                      </span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      Accepted{" "}
                      <span className="font-medium text-emerald-600">
                        {counts.accepted}
                      </span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      Rejected{" "}
                      <span className="font-medium text-rose-600">
                        {counts.rejected}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshList}
                    >
                      <RotateCcw className="mr-1 h-4 w-4" /> Refresh
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bulkUpdate("accepted")}
                      disabled={visibleMatches.length === 0}
                    >
                      <Check className="mr-1 h-4 w-4" /> Accept all
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bulkUpdate("rejected")}
                      disabled={visibleMatches.length === 0}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject all
                    </Button>
                  </div>
                </div>
                {visibleMatches.length === 0 ? (
                  <Card className="p-10 text-center text-sm text-muted-foreground">
                    No {statusFilter !== "all" ? statusFilter : ""} matches to
                    review.
                  </Card>
                ) : (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleMatches.map((m) => (
                      <MatchCard
                        key={m.product_id}
                        match={m}
                        onUpdate={(s) => updateStatus(m.product_id, s)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function MainProductCard({ group }: { group: MappingGroup }) {
  const p = group.mainProduct;
  return (
    <Card className="h-fit overflow-hidden">
      <ZoomableImage src={p.image_url} alt={p.title} className="aspect-[3/4]" />
      <div className="space-y-3 p-4">
        <Badge variant="secondary" className="text-xs">
          {MAPPING_TYPE_LABEL[p.mapping_type]}
        </Badge>
        <div>
          <h2 className="font-semibold leading-snug">{p.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">ID: {p.product_id}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          {p.designer_name && (
            <Field label="Designer" value={p.designer_name} />
          )}
          {p.base_color && <Field label="Base colour" value={p.base_color} />}
        </dl>
        <p className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          {MAPPING_TYPE_INSTRUCTION[p.mapping_type]}
        </p>
      </div>
    </Card>
  );
}

function MatchCard({
  match,
  onUpdate,
}: {
  match: import("@/lib/mapping-data").MatchProduct;
  onUpdate: (s: MatchStatus) => void;
}) {
  const accepted = match.status === "accepted";
  const rejected = match.status === "rejected";
  return (
    <Card
      className={`overflow-hidden transition-all ${
        accepted ? "ring-2 ring-emerald-500/60" : ""
      } ${rejected ? "opacity-60" : ""}`}
    >
      <ZoomableImage
        src={match.image_url}
        alt={match.title}
        className="aspect-[3/4]"
      />
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{match.title}</h3>
            <p className="text-xs text-muted-foreground">ID: {match.product_id}</p>
          </div>
          <StatusBadge status={match.status} />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {match.base_color && <span>{match.base_color}</span>}
          {match.designer_name && <span>{match.designer_name}</span>}
          {typeof match.similarity_score === "number" && (
            <span className="font-medium text-foreground">
              {match.similarity_score}% match
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant={accepted ? "default" : "outline"}
            className={`flex-1 ${
              accepted ? "bg-emerald-600 hover:bg-emerald-600/90" : ""
            }`}
            onClick={() => onUpdate(accepted ? "pending" : "accepted")}
            aria-label="Accept match"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={rejected ? "default" : "outline"}
            className={`flex-1 ${
              rejected ? "bg-destructive hover:bg-destructive/90" : ""
            }`}
            onClick={() => onUpdate(rejected ? "pending" : "rejected")}
            aria-label="Reject match"
          >
            <X className="h-4 w-4" />
          </Button>
          {(accepted || rejected) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUpdate("pending")}
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const map: Record<MatchStatus, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${map[status]}`}
    >
      {status}
    </span>
  );
}

function ZoomableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`group relative w-full overflow-hidden bg-muted ${className ?? ""}`}
        >
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
          <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-background/80 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-2">
        <img src={src} alt={alt} className="h-auto w-full rounded-md" />
      </DialogContent>
    </Dialog>
  );
}
