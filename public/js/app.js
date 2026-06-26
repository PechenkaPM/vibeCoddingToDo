const titleInput = document.querySelector("#title");
if (titleInput) {
  titleInput.focus();
}

// --- PostHog: збір подій ---
function captureThenSubmit(form, eventName, getProps) {
  if (!form) return;
  form.addEventListener("submit", (e) => {
    if (window.posthog && typeof posthog.capture === "function") {
      e.preventDefault();
      posthog.capture(eventName, getProps());
      setTimeout(() => form.submit(), 150);
    }
  });
}

// task_created
captureThenSubmit(
    document.querySelector(".composer-form"),
    "task_created",
    () => ({ title: titleInput ? titleInput.value : "" })
);

// task_completed / task_reopened / task_deleted
document.querySelectorAll(".todo-item").forEach((item) => {
  const isComplete = item.classList.contains("is-complete");
  const title = item.dataset.title || "";
  captureThenSubmit(
      item.querySelector('form[action$="/toggle"]'),
      isComplete ? "task_reopened" : "task_completed",
      () => ({ title })
  );
  captureThenSubmit(
      item.querySelector('form[action$="/delete"]'),
      "task_deleted",
      () => ({ title })
  );
});

// --- PostHog: фіче-флаг show-urgent-filter ---
if (window.posthog && typeof posthog.onFeatureFlags === "function") {
  posthog.onFeatureFlags(() => {
    if (posthog.isFeatureEnabled("show-urgent-filter")) {
      renderUrgentFilter();
    }
  });
}

function renderUrgentFilter() {
  if (document.querySelector("#urgent-filter")) return;
  const panelHead = document.querySelector(".panel-head");
  if (!panelHead) return;
  const btn = document.createElement("button");
  btn.id = "urgent-filter";
  btn.type = "button";
  btn.textContent = "Urgent only";
  btn.style.cssText = "margin-left:auto;padding:6px 12px;border-radius:8px;cursor:pointer;";
  let active = false;
  btn.addEventListener("click", () => {
    active = !active;
    document.querySelectorAll(".todo-item").forEach((item) => {
      const isUrgent = (item.dataset.title || "").toLowerCase().includes("urgent");
      item.style.display = active && !isUrgent ? "none" : "";
    });
  });
  panelHead.appendChild(btn);
}