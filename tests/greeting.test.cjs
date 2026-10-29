const { getCommitGreeting, showCommitGreeting } = require("../js/main.js");

describe("getCommitGreeting", () => {
  test("returns the morning greeting before noon", () => {
    expect(getCommitGreeting(9)).toBe("Good morning. Time to pull the latest changes.");
  });

  test("returns the afternoon greeting from 12:00 to 17:59", () => {
    expect(getCommitGreeting(12)).toBe("Good afternoon. Keep those commits small.");
    expect(getCommitGreeting(17)).toBe("Good afternoon. Keep those commits small.");
  });

  test("returns the evening greeting from 18:00", () => {
    expect(getCommitGreeting(18)).toBe("Good evening. Push before you log off.");
    expect(getCommitGreeting(23)).toBe("Good evening. Push before you log off.");
  });

  test("falls back to a neutral greeting for invalid hours", () => {
    expect(getCommitGreeting(24)).toBe("Hello, visitor. Ready to commit?");
    expect(getCommitGreeting(-1)).toBe("Hello, visitor. Ready to commit?");
    expect(getCommitGreeting("noon")).toBe("Hello, visitor. Ready to commit?");
  });
});

describe("showCommitGreeting", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("writes the greeting into #greeting on page load", () => {
    document.body.innerHTML = "<p id=\"greeting\"></p>";
    const message = showCommitGreeting(new Date(2026, 9, 29, 8, 0));
    expect(message).toBe("Good morning. Time to pull the latest changes.");
    expect(document.getElementById("greeting").textContent).toBe(message);
  });

  test("does nothing when the page has no #greeting element", () => {
    expect(showCommitGreeting(new Date())).toBeNull();
  });
});
