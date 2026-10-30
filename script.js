const PARTY = [
  {
    room: "Balcony",
    floor: 2,
    guests: [
      { name: "Aigerim", color: "green",  time: "20:45", aitu: false, things: ["cup", "bag"] },
      { name: "Aliya",   color: "yellow", time: "21:15", aitu: true,  things: ["phone", "glasses"] },
      { name: "Madina",  color: "red",    time: "22:10", aitu: false, things: ["phone", "glasses", "bag"] },
      { name: "Ivan",    color: "blue",   time: "20:10", aitu: true,  things: ["cup"] }
    ]
  },
  {
    room: "Hall",
    floor: 2,
    guests: [
      { name: "Arman",   color: "yellow", time: "20:35", aitu: false, things: ["bag"] },
      { name: "Sophia",  color: "purple", time: "21:20", aitu: true,  things: ["glasses"] },
      { name: "Dias",    color: "red",    time: "19:45", aitu: false, things: ["phone"] },
      { name: "Bekzat",  color: "green",  time: "20:55", aitu: true,  things: ["phone", "glasses", "bag"] },
      { name: "Aruzhan", color: "purple", time: "21:50", aitu: false, things: ["phone"] },
      { name: "Saule",   color: "blue",   time: "21:25", aitu: false, things: ["glasses"] }
    ]
  },
  {
    room: "Kitchen",
    floor: 1,
    guests: [
      { name: "Nurlan",  color: "red",    time: "19:40", aitu: false, things: ["phone", "bag"] },
      { name: "Emma",    color: "blue",   time: "20:15", aitu: false, things: ["cup"] },
      { name: "Timur",   color: "green",  time: "21:05", aitu: true,  things: ["phone", "cup"] },
      { name: "Sergey",  color: "yellow", time: "20:50", aitu: false, things: ["cup"] },
      { name: "Yerlan",  color: "purple", time: "21:40", aitu: true,  things: ["phone", "bag"] },
      { name: "Kamila",  color: "green",  time: "20:05", aitu: false, things: ["cup"] }
    ]
  },
  {
    room: "Living room",
    floor: 1,
    guests: [
      { name: "Daniel",  color: "blue",   time: "19:55", aitu: false, things: ["glasses"] },
      { name: "Natasha", color: "yellow", time: "20:30", aitu: false, things: ["cup", "phone", "bag"] },
      { name: "Askar",   color: "red",    time: "21:00", aitu: true,  things: ["bag"] },
      { name: "Zarina",  color: "green",  time: "21:10", aitu: false, things: ["bag", "phone", "crumbs"] },
      { name: "Inkar",   color: "purple", time: "20:20", aitu: false, things: ["phone"] }
    ]
  }
];

function avatarUrl(name) {
  return "https://api.dicebear.com/9.x/open-peeps/svg?seed=" + encodeURIComponent(name);
}
function toMinutes(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
const THING_ICON = { phone: "📱", glasses: "👓", bag: "👜", cup: "🥤", crumbs: "🍪" };
const THING_WORD = { phone: "a phone", glasses: "glasses", bag: "a bag", cup: "a cup", crumbs: "cake crumbs" };

function buildGuest(g) {
  const iconsHtml = g.things.map(t => THING_ICON[t]).join(" ");
  const classes = ["guest", "color-" + g.color, g.aitu ? "aitu" : "guest-only"]
    .concat(g.things.map(t => "has-" + t)).join(" ");

  const $card = $("<div></div>").addClass(classes).attr({
    "data-name": g.name, "data-color": g.color, "data-time": g.time,
    "data-min": toMinutes(g.time), "data-aitu": g.aitu ? "yes" : "no",
    "data-things": g.things.join(" ")
  });
  $card.html(`
    <div class="avatar-ring ring-${g.color}">
      <img src="${avatarUrl(g.name)}" alt="${g.name}" />
      ${g.aitu ? '<span class="aitu-badge">AI</span>' : ""}
    </div>
    <div class="g-name">${g.name}</div>
    <div class="g-time">🕐 ${g.time}</div>
    <div class="g-things">${iconsHtml}</div>
  `);
  return $card;
}

function renderHouse() {
  const $house = $("#house").empty();
  [2, 1].forEach(fl => {
    const $floor = $('<div class="floor"></div>').attr("data-floor", fl);
    $floor.append(`<div class="floor-tag">FLOOR ${fl}</div>`);
    PARTY.filter(r => r.floor === fl).forEach(r => {
      const $room = $('<section class="room"></section>')
        .attr({ "data-room": r.room, "data-floor": r.floor });
      $room.append(`
        <div class="room-head">
          <h3 class="room-title">${r.room}</h3>
          <button class="sort-btn" data-room="${r.room}">Sort by time</button>
        </div>`);
      const $guests = $('<div class="guests"></div>');
      r.guests.forEach(g => $guests.append(buildGuest(g)));
      $room.append($guests);
      $floor.append($room);
    });
    $house.append($floor);
  });
}

function spotlight($bright) {
  $(".guest").stop(true, false);
  $bright.fadeTo(300, 1);
  $(".guest").not($bright).fadeTo(300, 0.2);
}
function spotlightRooms($rooms) { spotlight($rooms.find(".guest")); }
function clearSpotlight() {
  $(".guest").stop(true, false).fadeTo(300, 1);
  $("#result").text("All guests bright again.");
}

const CASES = [
  { n: 1,  text: "Who is in the hall?", rooms: false,
    run: () => $('.room[data-room="Hall"]').find(".guest") },
  { n: 2,  text: "Who is dressed in yellow or purple?", rooms: false,
    run: () => $(".guest.color-yellow").add(".guest.color-purple") },
  { n: 3,  text: "Which AITU students are upstairs?", rooms: false,
    run: () => $('.floor[data-floor="2"]').find(".guest.aitu") },
  { n: 4,  text: "Who has glasses or a bag?", rooms: false,
    run: () => $(".guest.has-glasses").add(".guest.has-bag") },
  { n: 5,  text: "Who came with nothing at all?", rooms: false,
    run: () => $(".guest").filter('[data-things=""]') },
  { n: 6,  text: "Who has a phone but no bag?", rooms: false,
    run: () => $(".guest.has-phone").not(".has-bag") },
  { n: 7,  text: "Who arrived between 20:30 and 21:00 (inclusive)?", rooms: false,
    run: () => $(".guest").filter(function () { const m = $(this).data("min"); return m >= 1230 && m <= 1260; }) },
  { n: 8,  text: "Who arrived after 21:00 and is not an AITU student?", rooms: false,
    run: () => $(".guest").not(".aitu").filter(function () { return $(this).data("min") > 1260; }) },
  { n: 9,  text: "Who stands right next to Askar?", rooms: false,
    run: () => $('.guest[data-name="Askar"]').prev().add($('.guest[data-name="Askar"]').next()) },
  { n: 10, text: "Who stands last in each room?", rooms: false,
    run: () => $(".guests .guest:last-child") },
  { n: 11, text: "Who stands third in each room?", rooms: false,
    run: () => $(".guests .guest:nth-child(3)") },
  { n: 12, text: "Who stands after Timur in his room?", rooms: false,
    run: () => $('.guest[data-name="Timur"]').nextAll() },
  { n: 13, text: "Who stands right before someone in black?", rooms: false,
    run: () => $(".guest.color-black").prev() },
  { n: 14, text: "In which room is Aruzhan?", rooms: true,
    run: () => $('.guest[data-name="Aruzhan"]').closest(".room") },
  { n: 15, text: "Which rooms have fewer than 6 guests?", rooms: true,
    run: () => $(".room").filter(function () { return $(this).find(".guest").length < 6; }) },
  { n: 16, text: "In which rooms does somebody have a cup, but nobody wears glasses?", rooms: true,
    run: () => $(".room").has(".guest.has-cup").not(function () { return $(this).has(".guest.has-glasses").length > 0; }) },
  { n: 17, text: "Who came first to each room?", rooms: false,
    run: () => $(".room").map(function () {
      let $first = null, best = Infinity;
      $(this).find(".guest").each(function () { const m = $(this).data("min"); if (m < best) { best = m; $first = this; } });
      return $first;
    }) },
  { n: 18, text: "Case 18 — Miras joins (fadeIn).", rooms: false, special: "miras" },
  { n: 19, text: "Case 19 — Natasha leaves (fadeOut).", rooms: false, special: "natasha" },
  { n: 20, text: "Who took the cake? (the thief)", rooms: false,
    run: () => $('.floor[data-floor="1"] .guest')
      .filter(function () { return $(this).data("min") > 1260; })
      .filter(function () { return $(this).data("min") < 1290; })
      .filter(".has-crumbs").not(".has-cup")
      .filter(function () { return $(this).prev().hasClass("aitu") || $(this).next().hasClass("aitu"); }) }
];

function findRoom(name) { return PARTY.find(r => r.room === name); }
function removeFromArray(name) { PARTY.forEach(r => { r.guests = r.guests.filter(g => g.name !== name); }); }

function caseMiras() {
  if (!findRoom("Living room").guests.some(g => g.name === "Miras")) {
    const living = findRoom("Living room");
    const i = living.guests.findIndex(g => g.name === "Askar");
    living.guests.splice(i + 1, 0,
      { name: "Miras", color: "blue", time: "21:20", aitu: true, things: ["phone"] });
  }
  renderHouse();
  $('.guest[data-name="Miras"]').hide().fadeIn(600);
  $("#result").text("Case 18 → Miras appears smoothly with fadeIn(), between Askar and Inkar.");
}
function caseNatasha() {
  const $n = $('.guest[data-name="Natasha"]');
  if ($n.length) {
    $n.fadeOut(600, function () { $(this).remove(); removeFromArray("Natasha"); });
    $("#result").text("Case 19 → Natasha fades away with fadeOut() and leaves the page.");
  } else {
    $("#result").text("Natasha already left.");
  }
}

function buildButtons() {
  const $wrap = $("#caseButtons").empty();
  CASES.forEach(c => {
    const $b = $("<button></button>").text(c.n + ". " + c.text)
      .attr("data-case", c.n).toggleClass("case-20", c.n === 20);
    $b.on("click", function () {
      if (c.special === "miras") return caseMiras();
      if (c.special === "natasha") return caseNatasha();
      const $found = $(c.run());
      if (c.rooms) { spotlightRooms($found); } else { spotlight($found); }
      $found.css("position", "relative").stop(true, true).each(function () {
        $(this).animate({ top: "-14px" }, 150).animate({ top: "0px" }, 150);
      });
      const names = (c.rooms
        ? $found.map(function () { return $(this).data("room"); })
        : $found.map(function () { return $(this).data("name"); })).get();
      $("#result").text(`Case ${c.n}: ${c.text} → ${names.length} found: ${names.length ? names.join(", ") : "nobody"}`);
    });
    $wrap.append($b);
  });
  $("#clearBtn").on("click", clearSpotlight);
}

let cardOpen = false;
let cardOrigin = null;

function guestInfoText($guest) {
  const things = ($guest.data("things") || "").toString().split(" ").filter(Boolean);
  const thingWords = things.length ? things.map(t => THING_WORD[t]).join(", ") : "nothing";
  return {
    name: $guest.data("name"),
    color: $guest.data("color"),
    came: "Came at " + $guest.data("time"),
    aitu: $guest.data("aitu") === "yes" ? "AITU student" : "Not an AITU student",
    has: "Has " + thingWords,
    room: $guest.closest(".room").data("room")
  };
}

function openCard($guest) {
  if (cardOpen) { closeCard(true); }
  const info = guestInfoText($guest);
  const $av = $guest.find(".avatar-ring");
  const o = $av.offset();
  cardOrigin = { left: o.left, top: o.top, w: $av.outerWidth(), h: $av.outerHeight() };

  const roomButtons = PARTY.filter(r => r.room !== info.room)
    .map(r => `<button class="move-to" data-room="${r.room}">Move to ${r.room.toLowerCase()}</button>`)
    .join("");

  $("#guestCard").attr("data-name", info.name).html(`
    <div class="gc-top ${info.color}">
      <img class="gc-avatar" src="${avatarUrl(info.name)}" alt="${info.name}" />
      <div><div class="gc-name">${info.name}</div><div>${info.room}</div></div>
    </div>
    <div class="gc-body">
      <p>🕐 ${info.came}</p>
      <p>🎓 ${info.aitu}</p>
      <p>🎒 ${info.has}</p>
      <p>👕 Wearing ${info.color}</p>
      <div class="gc-moves">${roomButtons}</div>
    </div>
  `);

  $("#cardOverlay").addClass("open").attr("aria-hidden", "false");
  const $card = $("#guestCard").stop(true, true).css({
    left: cardOrigin.left, top: cardOrigin.top,
    width: cardOrigin.w, transform: "scale(.15)", opacity: .2, display: "block"
  });

  const targetW = 300;
  const targetLeft = Math.max(12, (window.innerWidth - targetW) / 2);
  const targetTop = Math.max(12, (window.innerHeight - $card.outerHeight()) / 2);

  $card.css({ transition: "all .35s ease", width: targetW });
  requestAnimationFrame(() => {
    $card.css({ left: targetLeft, top: targetTop, transform: "scale(1)", opacity: 1 });
  });
  cardOpen = true;

  $card.find(".move-to").on("click", function (e) {
    e.stopPropagation();
    const target = $(this).data("room");
    const name = info.name;
    closeCard(true);
    moveGuest(name, target);
  });
}

function closeCard(instant) {
  if (!cardOpen) return;
  const $card = $("#guestCard").stop(true, true);
  const done = () => {
    $("#cardOverlay").removeClass("open").attr("aria-hidden", "true");
    $card.css({ transition: "", transform: "", display: "none" });
    cardOpen = false;
  };
  if (instant || !cardOrigin) { done(); return; }
  $card.css({ transition: "all .3s ease" });
  requestAnimationFrame(() => {
    $card.css({ left: cardOrigin.left, top: cardOrigin.top, transform: "scale(.15)", opacity: 0 });
  });
  setTimeout(done, 320);
}

let moving = false;
function moveGuest(name, targetRoomName) {
  if (moving) return;
  const $guest = $(`.guest[data-name="${name}"]`);
  if (!$guest.length) return;
  moving = true;

  const from = $guest.offset();
  const w = $guest.outerWidth(), h = $guest.outerHeight();

  const $clone = $guest.clone().addClass("flying-clone")
    .css({ left: from.left, top: from.top, width: w, height: h, opacity: 1 })
    .appendTo("body");

  const $oldHolder = $('<div class="place-holder"></div>').css({ width: w });
  $guest.after($oldHolder);
  $guest.detach();
  $oldHolder.animate({ width: 0 }, 400, function () { $oldHolder.remove(); });

  const $targetGuests = $(`.room[data-room="${targetRoomName}"] .guests`);
  const $newHolder = $('<div class="place-holder"></div>').css({ width: 0 }).appendTo($targetGuests);

  $newHolder.animate({ width: w }, 400, function () {
    const to = $newHolder.offset();
    $clone.stop(true, false).animate({ left: to.left, top: to.top }, 450, function () {
      $guest.appendTo($targetGuests);
      $newHolder.remove();
      $clone.remove();
      moveInArray(name, targetRoomName);
      moving = false;
      $("#result").text(`${name} moved to ${targetRoomName}. The array was updated too.`);
    });
  });
}

function moveInArray(name, targetRoomName) {
  let guest = null;
  PARTY.forEach(r => {
    const i = r.guests.findIndex(g => g.name === name);
    if (i >= 0) { guest = r.guests.splice(i, 1)[0]; }
  });
  if (guest) findRoom(targetRoomName).guests.push(guest);
}

function slideReorder($container, orderedEls) {
  const first = {};
  $container.children(".guest").each(function () { first[$(this).data("name")] = $(this).offset(); });
  orderedEls.forEach(el => $container.append(el));
  $container.children(".guest").each(function () {
    const $el = $(this);
    const name = $el.data("name");
    const oldPos = first[name];
    const newPos = $el.offset();
    if (!oldPos) return;
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    $el.stop(true, false)
      .css({ position: "relative", left: dx, top: dy })
      .animate({ left: 0, top: 0 }, 450, function () { $el.css({ position: "", left: "", top: "" }); });
  });
}

function sortRoom(roomName, $btn) {
  const $container = $(`.room[data-room="${roomName}"] .guests`);
  const sorted = $btn.hasClass("active");
  let ordered;
  if (!sorted) {
    ordered = $container.children(".guest").toArray().sort((a, b) => $(a).data("min") - $(b).data("min"));
    $btn.addClass("active").text("Picture order");
  } else {
    const names = findRoom(roomName).guests.map(g => g.name);
    ordered = names.map(n => $container.children(`.guest[data-name="${n}"]`)[0]).filter(Boolean);
    $btn.removeClass("active").text("Sort by time");
  }
  slideReorder($container, ordered);
}

$(function () {
  renderHouse();
  buildButtons();

  $("#house").on("click", ".guest", function (e) { e.stopPropagation(); openCard($(this)); });
  $("#house").on("click", ".sort-btn", function (e) { e.stopPropagation(); sortRoom($(this).data("room"), $(this)); });
  $(document).on("keydown", function (e) { if (e.key === "Escape") closeCard(false); });
  $("#cardOverlay").on("click", function (e) { if (e.target === this) closeCard(false); });
});
