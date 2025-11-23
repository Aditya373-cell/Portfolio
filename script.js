// Certificate Data Model
const certificates = [
  {
    name: "RHCSA",
    file: "rhcsa.pdf",
    tech: "Linux",
    verify: "RHCSA-2024-CHORAT"
  },
  {
    name: "RHCE",
    file: "rhce.pdf",
    tech: "Linux",
    verify: "RHCE-2024-CHORAT"
  },
  {
    name: "AWS Certification",
    file: "aws.pdf",
    tech: "AWS",
    verify: "AWS-2024-CHORAT"
  },
  {
    name: "Kubernetes Certification",
    file: "kubernetes.pdf",
    tech: "Kubernetes",
    verify: "K8S-2024-CHORAT"
  },
  {
    name: "AI & ML Certification",
    file: "ai-ml.pdf",
    tech: "AI",
    verify: "AIML-2025-CHORAT"
  },
  {
    name: "Data Science Training",
    file: "data-science.pdf",
    tech: "AI",
    verify: "DS-2025-CHORAT"
  },
  {
    name: "Tableau Training",
    file: "tableau.pdf",
    tech: "AI",
    verify: "TAB-2024-CHORAT"
  }
];

// Render certificates dynamically
const certList = document.getElementById("cert-list");

certificates.forEach(cert => {
  const item = document.createElement("div");
  item.className = "cert-item";
  item.setAttribute("data-cert", cert.tech);

  item.innerHTML = `
    <div class="cert-main">
      <div class="cert-name">${cert.name}</div>
      <div class="cert-meta">${cert.tech} Certificate</div>
    </div>
    <a class="cert-link" href="assets/certs/${cert.file}" target="_blank">
      View Certificate
    </a>
  `;

  certList.appendChild(item);
});

// Badge filtering
document.querySelectorAll("#cert-badges .badge").forEach(btn => {
  btn.addEventListener("click", () => {
    const tech = btn.dataset.tech;
    document.querySelectorAll("#cert-badges .badge").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".cert-item").forEach(item => {
      if (tech === "ALL" || item.getAttribute("data-cert") === tech) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Year auto-fill
document.getElementById("year").innerText = new Date().getFullYear();
