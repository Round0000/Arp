const scales = {
  C_Major: ["C", "D", "E", "F", "G", "A", "B"],
  C_Lydian: ["C", "D", "E", "Fs", "G", "A", "B"],
  Cs_Major: ["Cs", "Ds", "F", "Fs", "Gs", "As", "C"],
  E_Major: ["E", "Fs", "Gs", "A", "B", "Cs", "Ds"],
  E_Major: ["E", "Fs", "Gs", "A", "B", "Cs", "Ds"],
  A_Minor_Melodic: ["A", "B", "C", "D", "E", "Fs", "Gs"],
};

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

let currentSeq;

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
  currentSeq = unitObjects;
  console.log("Current sequence : ", currentSeq);
  unitObjects.forEach((unit) => {
    playSequence(unit);
  });
});

let intervals = [];

function playSequence(o) {
  let c = 0;
  if (o.random) {
    let interval = setInterval(() => {
      let noteToPlay = o.notes[getRandom(0, o.notes.length - 1)];
      console.log("Random note :", noteToPlay);
      if (noteToPlay.length > 1) {
        playNote(noteToPlay);
      }
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

saveSeqBtn.addEventListener("click", () => {
  if (currentSeq) {
    demos.push(currentSeq);
    displayDemos();
  }
});

function createUnit() {
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

addUnitBtn.addEventListener("click", () => {
  if (document.querySelectorAll(".arpUnit").length < 4) {
    createUnit();
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
    e.target.parentElement.parentElement.remove();
  }
  if (e.target.classList.contains("resetUnitBtn")) {
    e.target.parentElement.parentElement
      .querySelectorAll(".inputNote")
      .forEach((el) => {
        el.value = "";
      });
    e.target.parentElement.parentElement.querySelector(".inputTempo").value =
      "";
  }

  if (e.target.dataset.note) {
    e.target.classList.add("active");
    setTimeout(() => {
      e.target.classList.remove("active");
    }, 200);

    currentNoteInput.value =
      e.target.dataset.note + e.target.parentElement.dataset.range;

    currentNoteInput.nextElementSibling.focus();
  }

  if (e.target.classList.contains("scaleSelect")) {
    console.log(e.target.value);
    updateScale(arp1, scales[e.target.value]);
  }
});

function playGroup(obj) {
  stopAll();
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
  [
    {
      n: "1",
      tempo: 300,
      notes: ["A3", "B3", "C3", "D3", "E3", "Fs3", "Gs3", "D2"],
      random: false,
    },
    {
      n: "2",
      tempo: 300,
      notes: [
        "A1",
        "A1",
        "A1",
        "A1",
        "A1",
        "A1",
        "A1",
        "D1",
        "C1",
        "C1",
        "C1",
        "C1",
        "C1",
        "C1",
        "C1",
        "G1",
      ],
      random: false,
    },
    {
      n: "3",
      tempo: 600,
      notes: [
        "B4",
        "E4",
        "Gs4",
        "E4",
        "-",
        "E4",
        "-",
        "C4",
        "A4",
        "-",
        "D4",
        "E4",
        "-",
      ],
      random: false,
    },
    {
      n: "4",
      tempo: 900,
      notes: ["A4", "Gs4", "B4"],
      random: false,
    },
  ],

  [
    {
      n: "1",
      tempo: 150,
      notes: ["C2", "E2", "G2", "B2", "D3", "F2", "A3", "E3"],
      random: false,
    },
  ],
];

function displayDemos() {
  demosArea.innerHTML = "";
  demos.forEach((demo) => {
    const newDemo = document.createElement("BUTTON");
    newDemo.id = demos.indexOf(demo) + 1;
    newDemo.innerText = demos.indexOf(demo) + 1;
    demosArea.appendChild(newDemo);
    newDemo.addEventListener("click", () => {
      console.log("playing demo " + newDemo.id, demo);
      demosTitle.querySelector("span").innerText = " " + newDemo.id;
      playGroup(demo);
      openConfig(demo);
    });
  });
}

function openConfig(conf) {
  document.querySelectorAll(".arpUnit").forEach((i) => {
    if (i.id != "arp1") {
      i.remove();
    }
  });

  if (conf[0]) {
    arp.arpTempo1.value = conf[0].tempo;
    arp.arpRandom1.value = conf[0].random;
    for (let i = 0; i < conf[0].notes.length; i++) {
      arp.arpNote1[i].value = conf[0].notes[i];
    }
  }
  if (conf[1]) {
    createUnit();
    arp.arpTempo2.value = conf[1].tempo;
    arp.arpRandom2.value = conf[1].random;
    for (let i = 0; i < conf[1].notes.length; i++) {
      arp.arpNote2[i].value = conf[1].notes[i];
    }
  }
  if (conf[2]) {
    createUnit();
    arp.arpTempo3.value = conf[2].tempo;
    arp.arpRandom3.value = conf[2].random;
    for (let i = 0; i < conf[2].notes.length; i++) {
      arp.arpNote3[i].value = conf[2].notes[i];
    }
  }
  if (conf[3]) {
    createUnit();
    arp.arpTempo4.value = conf[3].tempo;
    arp.arpRandom4.value = conf[3].random;
    for (let i = 0; i < conf[3].notes.length; i++) {
      arp.arpNote4[i].value = conf[3].notes[i];
    }
  }
}

displayDemos();

// Scale UI update

function updateScale(unit, scale) {
  unit.querySelectorAll(".noteRange").forEach((range) => {
    range.innerHTML = "";
    scale.forEach((note) => {
      const newNote = document.createElement("LI");
      newNote.innerText = note;
      newNote.innerText.replaceAll("s", "#");
      newNote.dataset.note = note;
      range.appendChild(newNote);
    });
  });
}
