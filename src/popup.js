export class Popup {
  constructor(dailyData = {}) {
    this._piles = dailyData.piles || {};
    this._date  = dailyData.date  || null;
    this._panel = this._build();
    document.body.appendChild(this._panel);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this._open && !this._panel.contains(e.target)) {
        this.hide();
      }
    });
  }

  _build() {
    const panel = document.createElement('div');
    panel.className = 'info-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="panel-icon"></span>
          <span class="panel-name"></span>
          <span class="panel-category"></span>
        </div>
        <button class="panel-close" aria-label="Close">✕</button>
      </div>
      <div class="panel-body">
        <img class="panel-photo" alt="" />
        <p class="panel-description"></p>
        <hr class="panel-divider" />
        <div class="panel-detail-row hours-row">
          <span class="detail-label">Hours</span>
          <span class="hours-val"></span>
        </div>
        <div class="panel-detail-row contact-row">
          <span class="detail-label">Contact</span>
          <span class="contact-val"></span>
        </div>
        <div class="tonnage-section" style="display:none">
          <hr class="panel-divider" />
          <div class="psd-title">Today's Stockpile</div>
          <div class="tonnage-display">
            <span class="tonnage-val"></span>
            <span class="tonnage-date"></span>
          </div>
          <div class="tonnage-warning" style="display:none">
            ⚠ Low stock — replenishment required
          </div>
        </div>
        <div class="psd-section" style="display:none">
          <hr class="panel-divider" />
          <div class="psd-title">Particle Size Distribution</div>
          <div class="psd-rows"></div>
        </div>
      </div>
    `;

    panel.querySelector('.panel-close').addEventListener('click', () => this.hide());

    return panel;
  }

  show(building) {
    const p = this._panel;

    p.querySelector('.panel-icon').textContent     = building.icon;
    p.querySelector('.panel-name').textContent     = building.name;
    p.querySelector('.panel-category').textContent = building.category;
    p.querySelector('.panel-description').textContent = building.description;

    const photo = p.querySelector('.panel-photo');
    if (building.photo) {
      photo.src = building.photo;
      photo.style.display = 'block';
    } else {
      photo.style.display = 'none';
    }

    const hoursRow = p.querySelector('.hours-row');
    if (building.hours) {
      p.querySelector('.hours-val').textContent = building.hours;
      hoursRow.style.display = 'flex';
    } else {
      hoursRow.style.display = 'none';
    }

    const contactRow = p.querySelector('.contact-row');
    if (building.contact) {
      p.querySelector('.contact-val').textContent = building.contact;
      contactRow.style.display = 'flex';
    } else {
      contactRow.style.display = 'none';
    }

    const tonnageSection = p.querySelector('.tonnage-section');
    const dailyEntry = this._piles[building.meshName];
    if (dailyEntry?.tonnes != null) {
      const t        = dailyEntry.tonnes;
      const critical = dailyEntry.criticalThreshold ?? 100;
      const low      = dailyEntry.lowThreshold      ?? 300;

      const status = t < critical ? 'critical' : t < low ? 'low' : 'normal';
      const warnings = {
        critical: '⚠ Critical - replenish immediately',
        low:      '⚠ Low stock - schedule replenishment',
        normal:   '',
      };

      const valEl = p.querySelector('.tonnage-val');
      valEl.textContent = `${t.toLocaleString()} t`;
      valEl.dataset.status = status;

      p.querySelector('.tonnage-date').textContent = this._date ? `as of ${this._date}` : '';

      const warningEl = p.querySelector('.tonnage-warning');
      if (status !== 'normal') {
        warningEl.textContent  = warnings[status];
        warningEl.dataset.status = status;
        warningEl.style.display = 'flex';
      } else {
        warningEl.style.display = 'none';
      }

      tonnageSection.style.display = 'block';
    } else {
      tonnageSection.style.display = 'none';
    }

    const psdSection = p.querySelector('.psd-section');
    if (building.granulometry?.length) {
      p.querySelector('.psd-rows').innerHTML = building.granulometry.map(({ sieve, passing }) => `
        <div class="psd-row">
          <span class="psd-sieve">${sieve}</span>
          <div class="psd-bar-wrap"><div class="psd-bar" style="width:${passing}%"></div></div>
          <span class="psd-pct">${passing}%</span>
        </div>
      `).join('');
      psdSection.style.display = 'block';
    } else {
      psdSection.style.display = 'none';
    }

    p.classList.add('open');
    this._open = true;
  }

  hide() {
    this._panel.classList.remove('open');
    this._open = false;
  }
}
