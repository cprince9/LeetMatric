
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("medium-label");
    const hardlabel = document.getElementById("hard-label");
    const cardstatsContainer = document.querySelector(".stats-card");

    function validateusername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
        if (!regex.test(username)) {
            alert("Invalid username");
            return false;
        }
        return true;
    }

    async function fatchuserdetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }
            const parsedata = await response.json();
            displayUserData(parsedata);
        } catch (error) {
            alert(error.message);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgess(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedata) {
        const cardsData = [
            { label: "Overall Submission", value: parsedata.totalSolved },
            { label: "Overall Easy Submission", value: parsedata.easySolved },
            { label: "Overall Medium Submission", value: parsedata.mediumSolved },
            { label: "Overall Hard Submission", value: parsedata.hardSolved },
        ];

        updateProgess(parsedata.easySolved, parsedata.totalEasy, easylabel, easyProgressCircle);
        updateProgess(parsedata.mediumSolved, parsedata.totalMedium, mediumlabel, mediumProgressCircle);
        updateProgess(parsedata.hardSolved, parsedata.totalHard, hardlabel, hardProgressCircle);

        cardstatsContainer.innerHTML = cardsData.map(data =>
            `<div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
            </div>`
        ).join("");

        document.querySelectorAll(".card").forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = "translateY(0)";
            }, 100 * index);
        });
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        if (validateusername(username)) {
            fatchuserdetails(username);
        }
    });
});