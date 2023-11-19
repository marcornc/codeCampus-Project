import { Router } from "express";

import {
    getEvents,
    updateEventAttendees,
    getSocialEvents,
    getTechEvents,
    getOnlineEvents
  } from "./events.controller.js";

  export const eventsRouter = Router();

  eventsRouter.get("/", getEvents);
  eventsRouter.get("/social", getSocialEvents);
  eventsRouter.get("/online", getOnlineEvents);
  eventsRouter.get("/tech", getTechEvents);
  eventsRouter.patch("/:id", updateEventAttendees);

//  export default eventsRouter;