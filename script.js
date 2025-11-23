// ===== Data model for certificates =====
const certificates = [
  {
    id: "RHCSA",
    name: "Red Hat Certified System Administrator (RHCSA)",
    provider: "Red Hat",
    tech: "Linux",
    file: "assets/certs/rhcsa.pdf",
    verifyCode: "RHCSA-1234-5678",
    meta: "Linux administration • users • services • storage • security"
  },
  {
    id: "RHCE",
    name: "Red Hat Certified Engineer (RHCE)",
    provider: "Red Hat",
    tech: "Linux",
    file: "assets/certs/rhce.pdf",
    verifyCode: "RHCE-2345-6789",
    meta: "Automation with Ansible • advanced RHEL operations"
  },
  {
    id: "AWS",
    name: "AWS Certification (Associate)",
    provider: "Amazon Web Services",
    tech: "AWS",
    file: "assets/certs/aws.pdf",
    verifyCode: "AWS-9876-5432",
    meta: "VPC • EC2 • IAM • RDS • monitoring"
  },
  {
    id: "Docker",
    name: "Docker Certification",
    provider: "Docker",
    tech: "Docker",
    file: "assets/certs/docker.pdf",
    verifyCode: "DOCKER-1111-2222",
    meta: "Images • containers • registries • orchestration basics"
  },
  {
    id: "Kubernetes",
    name: "Kubernetes Certification (e.g. CKA)",
    provider: "CNCF",
    tech: "Kubernetes",
    file: "assets/certs/kubernetes.pdf",
    verifyCode: "K8S-3333-4444",
    meta: "Pods • deployments • services • troubleshooting"
  }
];

// ===== Helpers =====
function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

// ===== Nav active state on scroll (simple) =====
const navLinks = $all(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// ===== Projects filter =====
const projectFilterButtons = $all(".filter-btn");
const projects = $all(".project");

projectFilterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    projectFilterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    projects.forEach(project => {
      if (filter === "ALL") {
        project.classList.remove("hidden");
        return;
      }
      const tags = project.dataset.tags.split(",");
      if (tags.includes(filter)) {
        project.classList.remove("hidden");
      } else {
        project.classList.add("hidden");
      }
    });
  });
});

// ===== Certificates render + filters =====
const certListEl = $("#cert-list");
const certBadgeButtons = $all(".badge");

function renderCertificates(filterTech = "ALL") {
  certListEl.innerHTML = "";

  certificates
    .filter(cert => filterTech === "ALL" || cert.tech === filterTech)
    .forEach(cert => {
      const item = document.createElement("div");
      item.className = "cert-item";
      item.dataset.tech = cert.tech;

      item.innerHTML = `
        <div class="cert-main">
          <div class="cert-name">${cert.name}</div>
          <div class="cert-meta">${cert.provider} • ${cert.meta}</div>
        </div>
        <div class="cert-actions">
          <a href="${cert.file}" target="_blank" class="cert-link">View Certificate</a>
          <button class="cert-verify" data-cert-id="${cert.id}">Verify</button>
        </div>
      `;

      certListEl.appendChild(item);
    });

  // Attach verify button handlers after render
  $all(".cert-verify").forEach(btn => {
    btn.addEventListener("click", () => {
      openVerifyModal(btn.dataset.certId);
    });
  });
}

certBadgeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tech = btn.dataset.tech;
    certBadgeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (tech === "ALL") {
      renderCertificates("ALL");
    } else if (tech === "Linux") {
      // Special case: show both RHCSA & RHCE
      renderCertificates("Linux");
    } else {
      renderCertificates(tech);
    }
  });
});

// ===== Verify modal logic =====
const verifyModal = $("#verify-modal");
const verifySelect = $("#verify-cert-select");
const verifyInput = $("#verify-code-input");
const verifyResult = $("#verify-result");
const openVerifyBtn = $("#open-verify");
const openVerifyFromHero = $("#open-verify-from-hero");
const closeVerifyBtn = $("#close-verify");
const runVerifyBtn = $("#run-verify");

function openVerifyModal(preselectId) {
  verifyModal.classList.add("show");
  populateVerifySelect(preselectId);
  verifyInput.value = "";
  verifyResult.textContent = "";
  verifyResult.className = "verify-result";
}

function closeVerifyModal() {
  verifyModal.classList.remove("show");
}

function populateVerifySelect(preselectId) {
  verifySelect.innerHTML = "";
  certificates.forEach(cert => {
    const opt = document.createElement("option");
    opt.value = cert.id;
    opt.textContent = cert.name;
    verifySelect.appendChild(opt);
  });
  if (preselectId) {
    verifySelect.value = preselectId;
  }
}

function runVerification() {
  const selectedId = verifySelect.value;
  const enteredCode = verifyInput.value.trim();
  const cert = certificates.find(c => c.id === selectedId);

  if (!enteredCode) {
    verifyResult.textContent = "Enter the verification code from the certificate.";
    verifyResult.className = "verify-result verify-fail";
    return;
  }

  if (cert && enteredCode === cert.verifyCode) {
    verifyResult.textContent = `✅ Verified: ${cert.name} (${cert.provider})`;
    verifyResult.className = "verify-result verify-success";
  } else {
    verifyResult.textContent = "❌ Invalid code for this certificate.";
    verifyResult.className = "verify-result verify-fail";
  }
}

// Events
openVerifyBtn.addEventListener("click", () => openVerifyModal());
openVerifyFromHero.addEventListener("click", () => openVerifyModal());
closeVerifyBtn.addEventListener("click", closeVerifyModal);
runVerifyBtn.addEventListener("click", runVerification);
verifyModal.addEventListener("click", (e) => {
  if (e.target === verifyModal) {
    closeVerifyModal();
  }
});

// ===== Init =====
renderCertificates("ALL");

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

