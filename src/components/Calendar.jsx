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
      const response = await getTimeBlockingItems();

      const formatted = response.data.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        start: item.startTime,
        end: item.endTime,
        backgroundColor: "#6264A7",
        borderColor: "#6264A7",
        textColor: "#ffffff",
        extendedProps: {
          description: item.description,
        },
      }));

      setEvents(formatted);
    } catch (error) {
      console.error("Load failed:", error);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /* =========================
     CUSTOM EVENT RENDER
     ========================= */
  const renderEventContent = (eventInfo) => {
    return (
      <Tooltip
        title={
          <>
            <div><strong>{eventInfo.event.title}</strong></div>
            <div>{eventInfo.event.extendedProps.description}</div>
            <div>
              {eventInfo.timeText}
            </div>
          </>
        }
        arrow
      >
        <div
          style={{
            padding: "4px",
            fontSize: "12px",
            lineHeight: "1.2",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {eventInfo.event.title}
          </div>
          <div style={{ fontSize: "11px" }}>
            {eventInfo.event.extendedProps.description}
          </div>
        </div>
      </Tooltip>
    );
  };

  /* =========================
     CREATE BUTTON
     ========================= */
  const handleCreateClick = () => {
    setSelectedEvent(null);
    setOpen(true);
  };

  /* =========================
     SLOT SELECT
     ========================= */
  const handleDateSelect = (info) => {
    setSelectedEvent({
      start: info.startStr,
      end: info.endStr,
    });
    setOpen(true);
  };

  /* =========================
     EVENT CLICK
     ========================= */
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.extendedProps.description,
    });

    setOpen(true);
  };

  /* =========================
     SAVE (Optimistic)
     ========================= */
  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === formData.id
              ? {
                  ...e,
                  title: formData.title,
                  start: formData.start,
                  end: formData.end,
                  extendedProps: {
                    description: formData.description,
                  },
                }
              : e
          )
        );

        await editTimeBlocking(formData.id, formData);
      } else {
        const tempId = Date.now().toString();

        const newEvent = {
          id: tempId,
          title: formData.title,
          start: formData.start,
          end: formData.end,
          backgroundColor: "#6264A7",
          borderColor: "#6264A7",
          textColor: "#ffffff",
          extendedProps: {
            description: formData.description,
          },
        };

        setEvents((prev) => [...prev, newEvent]);

        const response = await createTimeBlocking(formData);

        setEvents((prev) =>
          prev.map((e) =>
            e.id === tempId
              ? { ...e, id: response.data.id.toString() }
              : e
          )
        );
      }

      setOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      loadEvents();
    }
  };

  /* =========================
     DELETE
     ========================= */
  const handleDelete = async (id) => {
    const backup = [...events];
    setEvents((prev) => prev.filter((e) => e.id !== id));

    try {
      await deleteTimeBlocking(id);
      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
      setEvents(backup);
    }
  };

  /* =========================
     DRAG
     ========================= */
  const handleEventDrop = async (info) => {
    try {
      await editTimeBlocking(info.event.id, {
        start: info.event.start,
        end: info.event.end,
      });
    } catch (error) {
      info.revert();
    }
  };

  /* =========================
     RESIZE
     ========================= */
  const handleEventResize = async (info) => {
    try {
      await editTimeBlocking(info.event.id, {
        start: info.event.start,
        end: info.event.end,
      });
    } catch (error) {
      info.revert();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleCreateClick}
      >
        Create Event
      </Button>

      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        selectable={true}
        editable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        events={events}
        eventContent={renderEventContent}
        height="85vh"
        timeFormat="HH:mm"
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