import express from "express"
import bodyParser from "body-parser"
import nlp from "compromise";

const app = express();
const port = 3000;

app.use(bodyParser.text());

app.post("/process-email", async (req, res) => {
  const emailContent = req.body;

  let workflow = {
    finalPrice: 0,
  };

  // Initialize variables
  let address = "";
  let areaOfHouse = "";
  let numberOfRooms = 0;
  let clientBudget = "";
  let roomsSpecialAttention = "";
  let devicesSpecialAttention = "";
  let typeOfCleaningService = "";

  // Process the email content using compromise
  const doc = nlp(emailContent);

  // Extract information using compromise's natural language processing capabilities
  doc.sentences().forEach((sentence) => {
    // (The rest of your code for extracting information goes here...)
    const text = sentence.text().toLowerCase();

    if (text.includes("i have") && text.includes("rooms")) {
      numberOfRooms = parseInt(sentence.match("#Cardinal").out("text")) || 0;
      workflow.numOfRooms = numberOfRooms;
    } else if (text.includes("budget")) {
      clientBudget = sentence.match("#Value").out("text");
    } else if (text.includes("yes please")) {
      roomsSpecialAttention = text.replace("yes please", "").trim();
    } else if (
      text.includes("window") ||
      text.includes("wall") ||
      text.includes("refrigerator") ||
      text.includes("oven")
    ) {
      devicesSpecialAttention = text;
    } else if (
      text.includes("standard clean") ||
      text.includes("deep cleaning without appliances") ||
      text.includes("deep cleaning with appliances") ||
      text.includes("move-in/move-out clean without appliances")
    ) {
      typeOfCleaningService = text;
    }

    // Check for square feet and extract area
    const areaMatch = text.match(/(\d+)\s*sq\s*ft/i);
    if (areaMatch) {
      areaOfHouse = areaMatch[1];
    }

    // Check for address and extract it
    const addressMatch = text.match(/\d{4,}[^.?!]*[.,?!]/);
    if (addressMatch) {
      address = addressMatch[0];
    }
  });

  // (The rest of your code for calculating the final price goes here...)
  async function findRange(value, ranges) {
    if (value > 4999) {
      return "> 4999";
    }
    for (const range of ranges) {
      const [start, end] = range.split(" - ").map(Number);
      if (value >= start && value <= end) {
        return range;
      }
    }
    return null;
  }

  if (areaOfHouse) {
    const ranges = [
      "1 - 999",
      "1000 - 1499",
      "1500 - 1999",
      "2000 - 2499",
      "2500 - 2999",
      "3000 - 3499",
      "3500 - 3999",
      "4000 - 4999",
    ];

    const result = await findRange(areaOfHouse, ranges);
    workflow.address = `${result} Sq Ft`;

    if (result) {
      console.log(`The value ${areaOfHouse} is in the range ${result}`);
      // workflow.address = `${result} Sq Ft`
    } else {
      console.log(
        `The value ${areaOfHouse} is not within any of the specified ranges.`
      );
    }
  }

  let service;
  if (typeOfCleaningService) {
    if (typeOfCleaningService.includes("standard")) {
      service = "Standard clean";
      workflow.typeOfService = service;
    } else if (
      typeOfCleaningService.includes("deep") &&
      typeOfCleaningService.includes("without")
    ) {
      service = "Deep cleaning without appliances";
      workflow.typeOfService = service;
    } else if (
      typeOfCleaningService.includes("deep") &&
      typeOfCleaningService.includes("with")
    ) {
      service = "Deep cleaning with appliances";
      workflow.typeOfService = service;
    } else {
      service = "Move-in/move-out clean without appliances";
      workflow.typeOfService = service;
    }
  }

  console.log("service", service);

  switch (workflow.typeOfService) {
    case "Standard clean":
      if (
        workflow.numOfRooms == "1" ||
        workflow.numOfRooms == "2" ||
        workflow.numOfRooms == "3" ||
        workflow.numOfRooms == "4+"
      ) {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 150;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 160;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 180;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 210;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 230;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 250;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 270;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 290;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 350;
        }
      }
      break;
    case "Deep cleaning without appliances":
      if (workflow.numOfRooms == "1") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 200;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 240;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 280;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 370;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 430;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 470;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 510;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 550;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 770;
        }
      }
      if (workflow.numOfRooms == "2") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 250;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 290;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 330;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 370;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 430;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 470;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 510;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 550;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 770;
        }
      }
      if (workflow.numOfRooms == "3") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 300;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 340;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 380;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 420;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 460;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 500;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 540;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 590;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 800;
        }
      }
      if (workflow.numOfRooms === "4+") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 300;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 340;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 350;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 390;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 430;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 470;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 510;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 550;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 770;
        }
      }
      break;
    case "Deep cleaning with appliances":
      if (workflow.numOfRooms == "1") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 200;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 240;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 280;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 370;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 430;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 470;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 510;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 550;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 770;
        }
      }
      if (workflow.numOfRooms == "2") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 250;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 290;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 330;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 370;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 430;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 470;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 510;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 550;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 770;
        }
      }
      if (workflow.numOfRooms == "3") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 300;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 340;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 380;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 420;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 460;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 500;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 540;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 590;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 800;
        }
      }
      if (workflow.numOfRooms === "4+") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 300;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 340;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 350;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 390;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 430;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 470;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 510;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 550;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 800;
        }
      }
      break;
    case "Move-in/move-out clean without appliances":
      if (workflow.numOfRooms == "1") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 320;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 380;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 440;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 500;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 560;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 620;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 680;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 740;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 850;
        }
      }
      if (workflow.numOfRooms == "2") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 380;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 440;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 500;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 560;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 620;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 680;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 740;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 800;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 950;
        }
      }
      if (workflow.numOfRooms == "3") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 320;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 380;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 440;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 500;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 560;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 620;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 680;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 720;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 850;
        }
      }
      if (workflow.numOfRooms === "4+") {
        if (workflow.address === "1 - 999 Sq Ft") {
          workflow.finalPrice += 380;
        } else if (workflow.address === "1000 - 1499 Sq Ft") {
          workflow.finalPrice += 440;
        } else if (workflow.address === "1500 - 1999 Sq Ft") {
          workflow.finalPrice += 500;
        } else if (workflow.address === "2000 - 2499 Sq Ft") {
          workflow.finalPrice += 560;
        } else if (workflow.address === "2500 - 2999 Sq Ft") {
          workflow.finalPrice += 620;
        } else if (workflow.address === "3000 - 3499 Sq Ft") {
          workflow.finalPrice += 680;
        } else if (workflow.address === "3500 - 3999 Sq Ft") {
          workflow.finalPrice += 740;
        } else if (workflow.address === "4000 - 4999 Sq Ft") {
          workflow.finalPrice += 800;
        } else if (workflow.address === ">4999 Sq Ft") {
          workflow.finalPrice += 950;
        }
      }
      break;
    default:
      break;
  }

  if (roomsSpecialAttention) {
    const words = roomsSpecialAttention.split(" ");
    words.forEach((word) => {
      if (
        word.includes("bathroom") ||
        word.includes("kitchen") ||
        word.includes("child") ||
        word.includes("pet")
      ) {
        workflow.finalPrice += 100;
      } else if (word.includes("basement") || word.includes("attic")) {
        workflow.finalPrice += 250;
      } else if (word.includes("home office")) {
        workflow.finalPrice += 50;
      } else if (word.includes("outdoor") || word.includes("garage")) {
        workflow.finalPrice += 150;
      }
    });
  }
  if (devicesSpecialAttention) {
    const words = devicesSpecialAttention.split(" ");
    words.forEach((word) => {
      if (word.includes("oven")) {
        workflow.finalPrice += 60;
      } else if (word.includes("refrigerator")) {
        workflow.finalPrice += 40;
      } else if (word.includes("wall")) {
        const result = parseInt(workflow.numOfRooms) * 25;
        workflow.finalPrice += result;
      }
    });
  }

  let finalPrice = workflow.finalPrice;
  const formattedString = clientBudget.replace(
    /(\d+)-(\d+)\s+USD/,
    "$1 - $2 USD"
  );
  const priceRange = formattedString;

  if (priceRange == "0-100") {
    if (finalPrice < 100) {
      finalPrice *= 1.1; // Increase finalPrice by 10%
    } else {
      finalPrice *= 0.9; // Decrease finalPrice by 10%
    }
  } else if (priceRange == "100-300") {
    if (finalPrice < 300) {
      finalPrice *= 1.1; // Increase finalPrice by 10%
    } else {
      finalPrice *= 0.9; // Decrease finalPrice by 10%
    }
  } else if (priceRange == "More than 300") {
    if (finalPrice > 300) {
      finalPrice *= 1.1; // Increase finalPrice by 10%
    } else {
      finalPrice *= 0.9; // Decrease finalPrice by 10%
    }
  }

  workflow.finalPrice = finalPrice;

  console.log({ workflow });
  // Prepare the response JSON
  const response = {
    address,
    areaOfHouse,
    numberOfRooms,
    clientBudget: clientBudget + " USD",
    roomsSpecialAttention,
    devicesSpecialAttention,
    typeOfCleaningService,
    finalPrice: workflow.finalPrice,
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
