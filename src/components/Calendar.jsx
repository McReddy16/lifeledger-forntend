import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Tooltip,
} from "@mui/material";

import {
  getTimeBlockingItems,
  createTimeBlocking,
  editTimeBlocking,
  deleteTimeBlocking,
} from "../api/timeBlockingApi";

import TimeBlockingTask from "../components/TimeBlockingTasks";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* =========================
     LOAD EVENTS
     ========================= */
  const loadEvents = useCallback(async () => {
    try {
      const data = await getTimeBlockingItems(); // <-- already array

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        setEvents([]);
        return;
      }

      const formatted = data.map((item) => {
        const start = new Date(`${item.taskDate}T${item.startTime}`);
        const end = new Date(`${item.endTaskDate}T${item.endTime}`);

        return {
          id: item.id.toString(),
          title: item.taskText,
          start,
          end,
          backgroundColor: "#6264A7",
          borderColor: "#6264A7",
          textColor: "#ffffff",
        };
      });

      console.log("FINAL EVENTS:", formatted);

      setEvents(formatted);
    } catch (error) {
      console.error("Load failed:", error);
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /* =========================
     EVENT DISPLAY
     ========================= */
  const renderEventContent = (eventInfo) => (
    <Tooltip
      title={
        <>
          <div><strong>{eventInfo.event.title}</strong></div>
          <div>{eventInfo.timeText}</div>
        </>
      }
      arrow
    >
      <div style={{ padding: "4px", fontSize: "12px" }}>
        <div style={{ fontWeight: 600 }}>
          {eventInfo.event.title}
        </div>
      </div>
    </Tooltip>
  );

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setOpen(true);
  };

  const handleDateSelect = (info) => {
    setSelectedEvent({
      start: info.startStr,
      end: info.endStr,
    });
    setOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
    });

    setOpen(true);
  };

  /* =========================
     SAVE EVENT
     ========================= */
  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await editTimeBlocking(formData.id, formData);
      } else {
        await createTimeBlocking(formData);
      }

      loadEvents();
      setOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  /* =========================
     DELETE EVENT
     ========================= */
  const handleDelete = async (id) => {
    try {
      await deleteTimeBlocking(id);
      loadEvents();
      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreateClick}>
        Create Event
      </Button>

      <FullCalendar
        timeZone="local"
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        allDaySlot={false}
        selectable={true}
        editable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        events={events}
        eventContent={renderEventContent}
        height="85vh"
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent?.id ? "Edit Time Block" : "Create Time Block"}
        </DialogTitle>
        <DialogContent>
          <TimeBlockingTask
            eventData={selectedEvent}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}