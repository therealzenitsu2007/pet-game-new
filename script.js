let textbox = document.getElementById("textbox");
let text = document.getElementById("thing");

// Declare backgroundSound globally so it's created only ONCE.
// It will be initialized with new Audio() inside the start() function.
let backgroundSound;

class Pet {
    constructor(name = "", type = "", boredom = 20, hunger = 10, tiredness = 0, strength = 0) {
        this.name = name;
        this.type = type;
        this.boredom = boredom;
        this.hunger = hunger;
        this.tiredness = tiredness;
        this.strength = strength;
        this.isMusicPlaying = false; // Track music state
    }

    // Helper method to ensure stats don't go below zero
    _clampStats() {
        if (this.boredom < 0) {
            this.boredom = 0;
        }
        if (this.hunger < 0) {
            this.hunger = 0;
        }
        if (this.tiredness < 0) {
            this.tiredness = 0;
        }
        if (this.strength < 0) {
            this.strength = 0;
        }
    }

    feed() {
        if (this.hunger <= 0) {
            console.log("Your pet is full!");
            textbox.value = "Your pet is full!";
            return;
        }
        let eatingSound = new Audio("eating.mp3");
        this.hunger -= 10;
        this.tiredness -= 10;
        this.boredom += 10;
        this._clampStats(); // Apply clamping after stat modification
        eatingSound.play();
        const message = `${this.name} ate, and they lost 10 hunger, 10 tiredness, but gained 10 boredom.`;
        console.log(message);
        textbox.value = message;
        text.innerText = "🍗";
    }

    play() {
        if (this.boredom <= 0) {
            console.log("Your pet has played enough!");
            textbox.value = "Your pet has played enough!";
            return;
        }
        let playingSound = new Audio("boing.mp3");
        playingSound.volume = 0.5;
        this.boredom -= 10;
        this.tiredness += 10;
        this.hunger += 10;
        this._clampStats();
        playingSound.play();
        const message = `${this.name} played, and they lost 10 boredom, but gained 10 hunger and 10 tiredness.`;
        console.log(message);
        textbox.value = message;
        text.innerText = "⚽";
    }

    sleep() {
        if (this.tiredness <= 0) {
            console.log("Your pet is not tired enough to sleep.");
            textbox.value = "Your pet is not tired enough to sleep!";
            return;
        }
        let sleepingSound = new Audio("sleeping.mp3");
        sleepingSound.volume = 0.5;
        this.tiredness -= 10;
        this.hunger += 10;
        this.boredom += 10;
        this._clampStats();
        sleepingSound.play();
        const message = `${this.name} slept, and they lost 20 tiredness, but gained 10 hunger and 10 boredom.`;
        console.log(message);
        textbox.value = message;
        text.innerText = "💤";
    }

    train() {
        if (this.tiredness >= 30) {
            textbox.value = `${this.name} is way too exhausted to lift weights!`;
            return;
        }

        // Imagine a cool workout sound here!
        let trainSound = new Audio("falling-of-heavy-object-291096.mp3");
        this.strength += 10;
        this.hunger += 10; // Training makes you hungry!
        this.tiredness += 10; // Training is tiring!
        this._clampStats();
        trainSound.play();

        const message = `${this.name} pumped some iron! They gained 10 strength, but gained 10 tiredness and 10 hunger.`;
        console.log(message);
        textbox.value = message;
        text.innerText = "💪";
    }

    stats() {
        let statsSound = new Audio("process.mp3");
        statsSound.play();
        const statsMessage = `Name: ${this.name} | Type: ${this.type} | Boredom: ${this.boredom} | Hunger: ${this.hunger} | Tiredness: ${this.tiredness} | Strength: ${this.strength}`;
        console.log(statsMessage.replace(/ \| /g, "\n")); // For console readability
        textbox.value = statsMessage;
        text.innerText = "📊";
    }

    recommend() {
        let reccomendSound = new Audio("click.mp3");
        reccomendSound.play();
        let recommendation = "";
        if (this.hunger >= 20) {
            recommendation = "You should feed your pet!";
        } else if (this.boredom >= 20) {
            recommendation = "You should play with your pet!";
        } else if (this.tiredness >= 20) {
            recommendation = "You should give your pet some rest!";
        } else {
            recommendation = "Your pet is doing fine!";
        }
        console.log(recommendation);
        textbox.value = recommendation;
        text.innerText = "❓";
    }

    /**
     * Toggles the background music on or off.
     * This function now correctly uses the single, globally defined backgroundSound object.
     */
    toggleMusic() {
        // 'backgroundSound' here refers to the global variable, not a new one
        // Correctly check if the audio is paused using the 'paused' property
        if (backgroundSound.paused) {
            backgroundSound.volume = 0.5; // Ensure volume is set correctly (0.0 to 1.0)
            backgroundSound
                .play()
                .then(() => {
                    this.isMusicPlaying = true;
                    textbox.value = "Music ON 🎵";
                    console.log("Background music started.");
                    text.innerText = "🎶";
                })
                .catch((e) => {
                    console.warn("Could not play music:", e);
                    textbox.value = "Failed to play music. Browser might still block autoplay.";
                });
        } else {
            // If music is playing, pause it
            backgroundSound.pause();
            this.isMusicPlaying = false;
            textbox.value = "Music OFF 🔇";
            console.log("Background music paused.");
        }
    }

    trail() {
        text.innerText = "🐁";
        // Check if we are already trailing
        if (this.isTrailing) {
            window.removeEventListener("mousemove", this._handleMouseMove);
            this.isTrailing = false;
            textbox.value = "Cursor Trail OFF 🚫";
            return;
        }

        this.isTrailing = true;
        textbox.value = "Cursor Trail ON ✨";

        // Helper to create the dots
        this._handleMouseMove = (e) => {
            let dot = document.createElement("div");
            dot.className = "trail";
            dot.style.left = e.pageX - 5 + "px";
            dot.style.top = e.pageY - 5 + "px";

            // Random colors because why not?!
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            document.body.appendChild(dot);

            // Self-destruct timer for the dots so they don't lag the page!
            setTimeout(() => {
                dot.style.opacity = "0";
                dot.style.transform = "scale(0.1)";
                setTimeout(() => dot.remove(), 200);
            }, 100);
        };

        window.addEventListener("mousemove", this._handleMouseMove);
    }

    start() {
        this.name = prompt("What do you want your pet's name to be?");
        if (!this.name) {
            this.name = "Buddy"; // Default if no name entered
        }

        this.type = prompt("What animal do you want your pet to be?");
        if (!this.type) {
            this.type = "creature"; // Default if no type entered
        }

        const welcomeMessage = `Say hello to your new pet, ${this.name} the ${this.type}!`;
        console.log(welcomeMessage);
        textbox.value = welcomeMessage;

        // Get the audio element from the HTML instead of creating a new one
        backgroundSound = document.getElementById("backgroundMusic");
        backgroundSound.volume = 0.1;

        // Note: The "Train" button is in the HTML but has no functionality yet.

        // Add event listeners for each button
        document.getElementById("feed").addEventListener("click", () => {
            this.feed();
        });

        document.getElementById("play").addEventListener("click", () => {
            this.play();
        });

        document.getElementById("sleep").addEventListener("click", () => {
            this.sleep();
        });
        document.getElementById("train").addEventListener("click", () => {
            this.train();
        });
        document.getElementById("stats").addEventListener("click", () => {
            this.stats();
        });

        document.getElementById("recommend").addEventListener("click", () => {
            this.recommend();
        });

        // Add event listener for the music toggle button
        document.getElementById("music").addEventListener("click", () => {
            this.toggleMusic();
        });

        document.getElementById("cursor-trail").addEventListener("click", () => {
            this.trail();
        });
        document.getElementById("thing").addEventListener("click", () => {
            let clicksound = new Audio("cookie-clicker-buy-sound.mp3");
            clicksound.play();
        });
        document.getElementById("random-bg").addEventListener("click", () => {
            // Generate a random number for Red component (0-255)
            const r = Math.floor(Math.random() * 256);
            // Generate a random number for Green component (0-255)
            const g = Math.floor(Math.random() * 256);
            // Generate a random number for Blue component (0-255)
            const b = Math.floor(Math.random() * 256);

            // Construct the RGB color string, e.g., "rgb(123, 45, 200)"
            const randomColor = `rgb(${r}, ${g}, ${b})`;

            // Apply the random color to the body's background
            document.body.style.backgroundColor = randomColor;
        });

        document.getElementById("reset-bg").addEventListener("click", () => {
            document.body.style.backgroundColor = "white";
        });

        document.getElementById("rainbow-bg").addEventListener("click", () => {
            document.body.classList.toggle("animated-rainbow");
        });
    }
}
let pet = new Pet();
pet.start();
