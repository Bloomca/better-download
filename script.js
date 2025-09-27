chrome.contextMenus.onClicked.addListener(function handleMenuItemClick(info) {
  if (info.mediaType && info.srcUrl) {
    downloadMedia(info);
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Better download",
    contexts: ["image", "video", "audio"],
    id: "better_download_media",
  });
});

async function downloadMedia(info) {
  console.log("downloading media:", info);

  try {
    let folderName = await getFoldersName(info);
    const urlElements = info.srcUrl.split("/");
    let name = urlElements[urlElements.length - 1];

    chrome.downloads.download({
      filename: `${folderName}/${name}`,
      conflictAction: "uniquify",
      url: info.srcUrl,
    });
  } catch (e) {
    console.log("something went wrong: ", e);
  }
}

async function getFoldersName(info) {
  const folderName = getFolderName(info);
  try {
    const { shouldUseFolder, commonFolderName } =
      await chrome.storage.local.get(["shouldUseFolder", "commonFolderName"]);

    if (!shouldUseFolder || !commonFolderName) return folderName;

    return `${commonFolderName}/${folderName}`;
  } catch (e) {
    return folderName;
  }
}

function getFolderName(info) {
  if (info.mediaType === "video") {
    return "videos";
  } else if (info.mediaType === "audio") {
    return "audios";
  } else if (info.srcUrl.endsWith("gif")) {
    return "gifs";
  } else {
    return "images";
  }
}
