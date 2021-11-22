let sample = "piano";

function getNote(key) {
  let audio = new Audio(`/audio/${sample}/${key}.mp3`);
  return audio;
}

function playNote(key) {
  let note = getNote(key);
  note.currentTime = 0;
  note.play();

  document.getElementById(key).classList.add("keyAnim");
  setTimeout(() => {
    document.getElementById(key).classList.remove("keyAnim");
  }, 150);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("key")) {
    playNote(e.target.id);
    e.target.classList.add("keyAnim");

    setTimeout(() => {
      e.target.classList.remove("keyAnim");
    }, 200);
  }
});

let keyboard_keys = document.querySelectorAll(".key");

let keys = [];
keyboard_keys.forEach((key) => {
  keys.push(key.id);
});

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

arp.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(arp);
  let units = document.querySelectorAll(".arpUnit");
  let unitObjects = [];
  units.forEach((unit) => {
    let n = unit.dataset.unit;
    let data = {
      n: n,
      tempo: parseInt(formData.get("arpTempo" + n)),
      notes: formData.getAll("arpNote" + n).filter((note) => note),
      random: formData.get("arpRandom" + n) === "true",
    };
    unitObjects.push(data);
  });
  console.log(unitObjects);
  unitObjects.forEach((unit) => {
    playSequence(unit);
  });
});

let intervals = [];

function playSequence(o) {
  let c = 0;
  if (o.random) {
    let interval = setInterval(() => {
      playNote(o.notes[getRandom(0, o.notes.length - 1)]);
    }, o.tempo);
    intervals.push(interval);
  } else {
    let interval = setInterval(() => {
      if (document.getElementById(o.notes[c])) {
        playNote(o.notes[c]);
      }
      c++;
      if (c >= o.notes.length) {
        c = 0;
      }
    }, o.tempo);
    intervals.push(interval);
  }
}

// Add unit

function stopAll() {
  intervals.forEach((i) => clearInterval(i));
}

stopBtn.addEventListener("click", () => {
  stopAll();
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    stopAll();
  }
});

addUnitBtn.addEventListener("click", () => {
  if (document.querySelectorAll(".arpUnit").length < 4) {
    const newUnit = document.createElement("DIV");
    const id = document.querySelectorAll(".arpUnit").length + 1;
    newUnit.classList.add("arpUnit");
    newUnit.dataset.unit = id;
    newUnit.id = "arp" + id;
    newUnit.innerHTML = arp1.innerHTML
      .replace("arpTempo1", "arpTempo" + id)
      .replaceAll("arpRandom1", "arpRandom" + id)
      .replaceAll("arpNote1", "arpNote" + id);
    units.appendChild(newUnit);
    addFocusEventListeners(newUnit);
  }
});

let currentNoteInput;

function addFocusEventListeners(unit) {
  unit.querySelectorAll(".inputNote").forEach((el) => {
    el.addEventListener("focus", (e) => {
      currentNoteInput = e.target;
    });
  });
}

addFocusEventListeners(arp1);

units.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeUnitBtn")) {
    e.target.parentElement.remove();
  }

  if (e.target.dataset.note) {
    e.target.classList.add('active');
    setTimeout(() => {
      e.target.classList.remove('active');
    }, 200);

    currentNoteInput.value =
      e.target.dataset.note + e.target.parentElement.dataset.range;

    currentNoteInput.nextElementSibling.focus();
  }
});

function playGroup(obj) {
  obj.forEach((unit) => {
    playSequence(unit);
  });
}

let demos = [
  [
    {
      n: "1",
      tempo: 210,
      notes: ["E2", "G2", "B2", "E2", "G3", "B2"],
      random: false,
    },
    {
      n: "2",
      tempo: 420,
      notes: ["B2", "A2", "G2", "A2", "C2"],
      random: false,
    },
    {
      n: "3",
      tempo: 630,
      notes: ["B3", " ", "E3", "A3", "C3", " ", "D3", "E3"],
      random: false,
    },
    {
      n: "4",
      tempo: 210,
      notes: ["C2", "G2", "E2", "A2", "G2"],
      random: false,
    },
  ],
  [
    {
      n: "1",
      tempo: 300,
      notes: ["C1", "E2", "G1", "A2"],
      random: false,
    },
    {
      n: "2",
      tempo: 300,
      notes: ["C3", "E3", "A3", "G3", "G2", "B3", "A3"],
      random: false,
    },
    {
      n: "3",
      tempo: 600,
      notes: ["E4", "G4", " ", "A4", "D4", "C4", " ", "B3"],
      random: false,
    },
    {
      n: "4",
      tempo: 600,
      notes: ["C2", "G2", "E2", "B2"],
      random: false,
    },
  ],
];

function displayDemos() {
  demos.forEach((demo) => {
    const newDemo = document.createElement("BUTTON");
    newDemo.id = demos.indexOf(demo) + 1;
    newDemo.innerText = demos.indexOf(demo) + 1;
    demosArea.appendChild(newDemo);
    newDemo.addEventListener("click", () => {
      console.log("playing demo " + newDemo.id, demo);
      playGroup(demo);
    });
  });
}

displayDemos();
