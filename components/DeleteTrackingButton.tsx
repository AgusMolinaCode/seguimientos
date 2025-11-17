"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteHistoryEntry } from "@/lib/history/tracking-history";

interface DeleteTrackingButtonProps {
  entryId: string;
  trackingNumber: string;
}

export function DeleteTrackingButton({ entryId, trackingNumber }: DeleteTrackingButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteHistoryEntry(entryId);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
            aria-label="Eliminar consulta"
          >
            <X className="w-4 h-4 mt-2" />
          </button>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>¿Eliminar consulta?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar la consulta del tracking{" "}
              <span className="font-mono font-semibold">{trackingNumber}</span>?
              <br />
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
