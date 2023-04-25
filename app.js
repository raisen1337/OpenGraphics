const progressBar = document.querySelector(".progressbar");
progressBar.style.width = 0;

const appStatus = document.querySelector("#appStatus");
const appOpen = document.querySelector(".appOpen");
const chooseGame = document.querySelector(".chooseGame");
const app = document.querySelector(".app");
const { ipcRenderer } = require("electron");
const settingsPage = document.querySelector(".appsettings");
const settings = document.querySelector("#settings");

const ragepathinput = document.querySelector('#ragemppath');
const fivempathinput = document.querySelector('#fivempath');

let rageOldPlaceHolder = ragepathinput.placeholder;
let fivemOldPlaceHolder = fivempathinput.placeholder;

ragepathinput.addEventListener('mouseenter', function() {
  this.placeholder = 'Click to change the path';
});

ragepathinput.addEventListener('mouseleave', function() {
  this.placeholder = getRagePath();
});

fivempathinput.addEventListener('mouseenter', function() {
  this.placeholder = 'Click to change the path';
});

fivempathinput.addEventListener('mouseleave', function() {
  this.placeholder = getFiveMPath();
});

fivempathinput.addEventListener('click', function() {
  ipcRenderer.send('openGame', 'fivem');
});

ragepathinput.addEventListener('click', function() {
  ipcRenderer.send('openGame', 'ragemp');
});

function getFiveMPath(){
  let path = localStorage.getItem('fivempath');
  if(path == null){
    return "Path not set."
  }else{
    return path;
  }
}

function getRagePath(){
  let path = localStorage.getItem('ragepath');
  if(path == null){
    return "Path not set."
  }else{
    return path;
  }
}

let mods = [
  {
    modname: "Natural Vision Evolved",
    modimg: "assets/img/nve.jpg",
    modauthor: "AUTHOR: Razed",
    moddesc: "Recommended specs: GTX 1070, 16GB RAM, A 6-CORE CPU WITH 2.9GHz. Supported platforms: FiveM / RAGEMP",
    supported: {
      fivem: true,
      ragemp: true
    }
  },
  {
    modname: "QuantV",
    modimg: "assets/img/quantv.webp",
    modauthor: "AUTHOR: Quant Mods",
    moddesc: "Recommended specs: GTX 1070, 16GB RAM, A 6-CORE CPU WITH 2.9GHz. Supported platforms: FiveM",
    supported: {
      fivem: true,
      ragemp: false
    }
  },
  {
    modname: "Make Visuals Great Again",
    modimg: "assets/img/mvga.jpg",
    modauthor: "AUTHOR: Kompetenzz",
    moddesc: "Recommended specs: GTX 1050, 16GB RAM, A 6-CORE CPU WITH 2.9GHz. Supported platforms: FiveM / RAGEMP",
    supported: {
      fivem: true,
      ragemp: true
    }
  },
  {
    modname: "Redux",
    modimg: "assets/img/redux.webp",
    modauthor: "AUTHOR: Josh Romito",
    moddesc: "Recommended specs: GTX 1050, 16GB RAM, A 6-CORE CPU WITH 2.9GHz. Supported platforms: FiveM / RAGEMP",
    supported: {
      fivem: true,
      ragemp: true
    }
  },
];

let canContinue = true;

function createMods(modsArray) {
  const modsContainer = document.querySelector('.mods');
  
  for (let i = 0; i < modsArray.length; i++) {
    const mod = modsArray[i];
    
    const modDiv = document.createElement('div');
    modDiv.className = 'mod';
    
    const modImg = document.createElement('img');
    modImg.src = mod.modimg;
    modImg.alt = '';
    modImg.className = 'modbg';
    modDiv.appendChild(modImg);
    
    const modInfoDiv = document.createElement('div');
    modInfoDiv.className = 'modinfo';
    
    const modName = document.createElement('p');
    modName.id = 'modname';
    modName.textContent = mod.modname;
    modInfoDiv.appendChild(modName);
    
    const modAuthor = document.createElement('p');
    modAuthor.id = 'modauthor';
    modAuthor.textContent = mod.modauthor;
    modInfoDiv.appendChild(modAuthor);
    
    const modDesc = document.createElement('p');
    modDesc.id = 'moddesc';
    modDesc.textContent = mod.moddesc;
    modInfoDiv.appendChild(modDesc);
    
    const modInstall = document.createElement('p');
    modInstall.id = 'modinstall';
    const modInstallIcon = document.createElement('i');
    modInstallIcon.className = 'fas fa-circle-chevron-down';
    modInstall.appendChild(modInstallIcon);

    modInstall.addEventListener('click', function() {
      if(!canContinue) return;

      document.addEventListener('keydown', function(e) {
        if(e.key == 'Escape') {
          const prompt = document.querySelector('.prompt');
          prompt.style.display = 'none';
        }
      });

      const prompt = document.querySelector('.prompt');
      prompt.style.display = 'flex';
      const fivemplatform = document.querySelector('#fivemplatform');
      const ragempplatform = document.querySelector('#ragempplatform');
      const promptmessage = document.querySelector('.promptcontainer p');
      if(mod.supported.fivem && mod.supported.ragemp){
        promptmessage.textContent = `Select the platform where ${mod.modname} will be installed`;
        ragempplatform.style.display = 'block';
        fivemplatform.style.display = 'block';
      }else if(mod.supported.fivem){
        promptmessage.textContent = `Select the platform where ${mod.modname} will be installed`;
        ragempplatform.style.display = 'none';
        fivemplatform.style.display = 'block';
      }else if(mod.supported.ragemp){
        fivemplatform.style.display = 'none';
        ragempplatform.style.display = 'block';
        promptmessage.textContent = `Select the platform where ${mod.modname} will be installed`;
      }
      fivemplatform.addEventListener('click', function() {
        const prompt = document.querySelector('.prompt');
        prompt.style.display = 'none';
        canContinue = false;
        const mods = document.querySelector('.mods');
        mods.style.display = 'none';

        const status = document.querySelector('.status');
        status.style.display = 'flex';

        ipcRenderer.send('installMod', {modname: mod.modname, platform: 'fivem'});
      });
      ragempplatform.addEventListener('click', function() {
        const prompt = document.querySelector('.prompt');
        prompt.style.display = 'none';
        canContinue = false;
        ipcRenderer.send('installMod', {modname: mod.modname, platform: 'ragemp'});
      });
    });

    modInfoDiv.appendChild(modInstall);
    
    modDiv.appendChild(modInfoDiv);
    
    modsContainer.appendChild(modDiv);
  }
}

function setProgressBarPercentage(percentage, duration) {
  const progressBar = document.querySelector(".progressbar");
  const maxWidth = 1300; // Maximum width of the progress bar in pixels
  const newWidth = Math.min(maxWidth, (maxWidth * percentage) / 100); // Calculate the new width, ensuring that it doesn't exceed the maximum width
  progressBar.style.width = `${newWidth}px`;
  progressBar.style.transition = `width ${duration}s ease-in-out`;
}

function pingIP(ip, port, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true); // status 2xx indicates success
        } else {
          reject(false); // any other status indicates failure
        }
      }
    };
    xhr.onerror = function () {
      reject(false);
    };
    xhr.open("HEAD", `http://${ip}:${port}`, true);
    xhr.send();
  });
}
function pingHost(host) {
  if (navigator.onLine) {
    return true;
  } else {
    return false;
  }
}

async function checkServerStatus(ipAddress) {}

document.addEventListener("DOMContentLoaded", () => {
  createMods(mods);
  appStatus.innerHTML = "Checking if our servers are online";
  const url = `http://130.61.210.150:1337/`;
  fetch(url)
    .then((response) => {
      if (response.ok) {
        setTimeout(() => {
            appStatus.innerHTML = "Our servers are online";
            setProgressBarPercentage(100, 2);
            setTimeout(() => {
                ipcRenderer.send('checkRegistry');
            }, 2000);
        }, 1200);
      } else {
        appStatus.innerHTML = "Our servers are offline";
        setProgressBarPercentage(100, 1);
      }
    })
    .catch((error) => {
      appStatus.innerHTML = "Our servers are offline";
      setProgressBarPercentage(100, 1);
    });
});

const selectPlatform = () => {
  appOpen.style.display = "none";
  chooseGame.style.display = "flex";
};

function launchApp() {
  appOpen.style.display = "none";
  app.style.display = "flex";
  const mods = document.querySelector(".mods");
  mods.style.display = "flex";
  setProgressBarPercentage(0, 1);
}

settings.addEventListener("click", () => {
  app.style.display = 'none';
  settingsPage.style.display = 'flex';
  ragepathinput.placeholder = getRagePath();
  fivempathinput.placeholder = getFiveMPath();
})

ipcRenderer.on("registryExist", (event, arg) => {
  if (arg === "true") {
    launchApp();
  } else {
    selectPlatform();
  }
});

ipcRenderer.on('changePath', (event, arg) => {
  console.log(arg)
  if(arg.game === 'fivem') {
    fivempathinput.placeholder = arg.path;
    localStorage.setItem('fivempath', arg.path);
  }else{
    ragepathinput.placeholder = arg.path;
    localStorage.setItem('ragepath', arg.path);
  }
})

const settingsBack = document.querySelector('#settingsback');

settingsBack.addEventListener('click', () => {
  settingsPage.style.display = 'none';
  app.style.display = 'flex';
})

const minimizeButton = document.querySelector("#minimize");
const quitButton = document.querySelector("#close");

minimizeButton.addEventListener("click", minimize);
quitButton.addEventListener("click", quitapp);

const fiveMButton = document.querySelector(".fivem");
const rageButton = document.querySelector(".ragemp");

fiveMButton.addEventListener("click", () => {
  console.log("a");
  ipcRenderer.send("openGame", "fivem");
});

rageButton.addEventListener("click", () => {
  ipcRenderer.send("openGame", "rage");
});

function minimize() {
  console.log("a");
  ipcRenderer.send("minimize");
}

function quitapp() {
  ipcRenderer.send("quitapp");
}



function searchMods() {
  // Get the search input value
  var input = document.querySelector(".appsearch").value.toLowerCase();

  // Get all the mod elements
  var mods = document.querySelectorAll(".mod");

  // Loop through each mod and check if it matches the search input
  for (var i = 0; i < mods.length; i++) {
    var name = mods[i].querySelector("#modname").textContent.toLowerCase();
    var author = mods[i].querySelector("#modauthor").textContent.toLowerCase();
    if (name.indexOf(input) > -1 || author.indexOf(input) > -1) {
      // If the mod matches the search input, display it
      mods[i].style.display = "block";
    } else {
      // If the mod doesn't match the search input, hide it
      mods[i].style.display = "none";
    }
  }
}
document.querySelector(".appsearch").addEventListener("input", searchMods);


function loadScript(url, callback) {
  var script = document.createElement('script');
  script.src = url;

  script.onload = function() {
    if (callback) {
      callback();
    }
  };

  document.head.appendChild(script);
}
