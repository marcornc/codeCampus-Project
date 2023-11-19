// Display Events Function
// displayEvents(): This asynchronous function fetches event data from the server based on eventType.
// It formats the data and appends the events to the ".events__feed" element as HTML content.
async function displayEvents(eventType = "All") {
  try {
    // Get the events feed element
    const eventFeed = document.querySelector(".events__feed");
    // Clear existing content
    eventFeed.innerHTML = "";
        // http://localhost:7001/events/
    // Construct API URL based on eventType
    let apiUrl = "https://codecamp-backend.onrender.com/events/";
    if (eventType !== "All") {
      apiUrl += `${eventType}`;
    }

    // Fetch event data from the server
    const response = await fetch(apiUrl);
    const eventsData = await response.json();
    const events = eventsData.payload;

    // Iterate over events and create HTML content for each event
    events.forEach((event) => {
      const {
        formatted_date,
        time,
        event_title,
        location,
        event_type,
        attendees,
        id,
      } = event;
      const timeFormatted = time.slice(0, 5);
      const imgUrl = getEventImageUrl(event_type);

      // Create event card HTML
      eventFeed.innerHTML += createEventHTML(
        formatted_date,
        timeFormatted,
        event_title,
        location,
        id,
        attendees,
        imgUrl
      );
    });

    // Return the fetched events
    return events;
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return [];
  }
}

// Function to determine event image URL based on event type
function getEventImageUrl(eventType) {
  switch (eventType) {
    case "Tech":
      return "./assets/green.png";
    case "Social":
      return "./assets/yellow.png";
    default:
      return "./assets/purple.png";
  }
}

// Function to create HTML for an event card
function createEventHTML(
  formattedDate,
  timeFormatted,
  eventTitle,
  location,
  eventId,
  attendees,
  imgUrl
) {
  return `
    <article class="event__card">
      <p class="event__date">${formattedDate} · ${timeFormatted}</p>
      <h2 class="event__title">${eventTitle}</h2>
      <p class="event__location">${location.replaceAll("-", "<br>")}</p>
      <p class="event__attendees">
        <span><img class="tick__icon" src="/assets/icons8-tick-32.png"></span>
        <span id="${eventId}_attendees">${attendees} people going</span>
      </p>
      <button type="button" id="${eventId}" class="button__small">Attend</button>
      <img class="events__image" src="${imgUrl}" alt="Social__Icon">
    </article>
  `;
}

// Function to handle attendance button click
async function attendButtonFunction(button_id) {
  const API_URL = `http://localhost:7000/events/${button_id}`;
  try {
    // Send a PATCH request to mark attendance
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    if (response.ok) {
      console.log("Successfully attended the event.");
      // Handle success
    } else {
      console.error("Failed to attend the event.");
      // Handle failure
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle fetch error
  }
}

// Function to handle patching display after attendance
async function patchDisplay(event) {
  const button = document.getElementById(event.id);
  const attendees = document.getElementById(`${event.id}_attendees`);

  // Call attendButtonFunction to mark attendance
  await attendButtonFunction(event.id);

  // Update button and attendees info
  button.textContent = "Attended";
  button.disabled = true;
  let newAtt = event.attendees + 1;
  attendees.textContent = `${newAtt} people going`;
}

// Function to attach event listeners for attendance to social events
async function filterEv(socialEv) {
  socialEv.forEach((event) => {
    const button = document.getElementById(event.id);
    button.addEventListener("click", async () => {
      await patchDisplay(event);
    });
  });
}

// Initialization Function
// init(): This function initializes event handling for different buttons ("Social__button", "Tech__button", and "Online__button").
// When these buttons are clicked, they call the filterEvents(eventType) function with the corresponding event type ("Social", "Tech", or "Online").
async function init() {
  // Fetch and display all events
  let myArray = await displayEvents();

  // Attach event listeners for attendance to each event button
  myArray.forEach((event) => {
    const button = document.getElementById(event.id);
    button.addEventListener("click", async () => {
      await patchDisplay(event);
    });
  });

  // Attach event listeners for category filtering buttons
  const allButton = document.querySelector(".All__button");
  allButton.addEventListener("click", async () => {
    myArray = await displayEvents("All");
    await filterEv(myArray);
  });
  const socialButton = document.querySelector(".Social__button");
  socialButton.addEventListener("click", async () => {
    myArray = await displayEvents("Social");
    await filterEv(myArray);
  });
  const techButton = document.querySelector(".Tech__button");
  techButton.addEventListener("click", async () => {
    myArray = await displayEvents("Tech");
    await filterEv(myArray);
  });
  const onlineButton = document.querySelector(".Online__button");
  onlineButton.addEventListener("click", async () => {
    myArray = await displayEvents("Online");
    await filterEv(myArray);
  });
}

// Initialize the event handling
init();
