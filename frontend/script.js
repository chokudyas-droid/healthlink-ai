// ============================================
// HEALTHLINK AI - MEDICATION REMINDER APP
// ============================================

// Data Management
const ReminderManager = {
    STORAGE_KEY: 'healthlink_reminders',
    
    // Get all reminders from localStorage
    getAllReminders() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save reminders to localStorage
    saveReminders(reminders) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
    },

    // Add new reminder
    addReminder(reminder) {
        const reminders = this.getAllReminders();
        reminder.id = Date.now();
        reminder.completed = false;
        reminder.createdAt = new Date().toISOString();
        reminders.push(reminder);
        this.saveReminders(reminders);
        return reminder;
    },

    // Update reminder
    updateReminder(id, updatedData) {
        const reminders = this.getAllReminders();
        const index = reminders.findIndex(r => r.id === id);
        if (index !== -1) {
            reminders[index] = { ...reminders[index], ...updatedData };
            this.saveReminders(reminders);
            return reminders[index];
        }
        return null;
    },

    // Delete reminder
    deleteReminder(id) {
        let reminders = this.getAllReminders();
        reminders = reminders.filter(r => r.id !== id);
        this.saveReminders(reminders);
    },

    // Toggle reminder completion
    toggleReminder(id) {
        const reminders = this.getAllReminders();
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            reminder.completed = !reminder.completed;
            this.saveReminders(reminders);
        }
    },

    // Clear all reminders
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// UI Manager
const UIManager = {
    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    // Update statistics
    updateStats() {
        const reminders = ReminderManager.getAllReminders();
        const totalReminders = reminders.length;
        const todayReminders = reminders.filter(r => {
            const reminderDate = new Date(r.createdAt).toDateString();
            const today = new Date().toDateString();
            return reminderDate === today;
        }).length;

        document.getElementById('totalReminders').textContent = totalReminders;
        document.getElementById('todayReminders').textContent = todayReminders;
    },

    // Toggle empty state
    toggleEmptyState() {
        const reminders = ReminderManager.getAllReminders();
        const emptyState = document.getElementById('emptyState');
        const list = document.getElementById('list');

        if (reminders.length === 0) {
            emptyState.style.display = 'block';
            list.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            list.style.display = 'block';
        }
    }
};

// Render reminders
function renderReminders() {
    const reminders = ReminderManager.getAllReminders();
    const list = document.getElementById('list');
    
    list.innerHTML = '';

    reminders.forEach(reminder => {
        const li = document.createElement('li');
        li.className = `reminder-item ${reminder.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="reminder-content">
                <div class="reminder-name">
                    <i class="fas fa-pill"></i> ${reminder.medicine}
                </div>
                <div class="reminder-details">
                    <span class="reminder-time">
                        <i class="fas fa-clock"></i> ${reminder.time}
                    </span>
                    <span class="reminder-badge">${reminder.dosage}</span>
                </div>
                <div class="reminder-details">
                    <strong>Frequency:</strong> ${reminder.frequency}
                    ${reminder.notes ? `<br><strong>Notes:</strong> ${reminder.notes}` : ''}
                </div>
            </div>
            <div class="reminder-actions">
                <button class="toggle-btn" onclick="toggleReminder(${reminder.id})" title="Mark as taken">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="edit-btn" onclick="openEditModal(${reminder.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteReminder(${reminder.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(li);
    });

    UIManager.toggleEmptyState();
    UIManager.updateStats();

    // Set up reminders notifications
    setupNotifications();
}

// Add medicine (form submission)
function addMedicine(event) {
    event.preventDefault();

    const medicine = document.getElementById('medicine').value.trim();
    const dosage = document.getElementById('dosage').value.trim();
    const frequency = document.getElementById('frequency').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value.trim();

    if (!medicine || !dosage || !frequency || !time) {
        UIManager.showToast('Please fill in all required fields', 'error');
        return;
    }

    const reminder = {
        medicine,
        dosage,
        frequency,
        time,
        notes
    };

    ReminderManager.addReminder(reminder);
    UIManager.showToast(`${medicine} reminder added successfully!`, 'success');
    
    // Reset form
    document.getElementById('reminderForm').reset();
    
    // Re-render
    renderReminders();
}

// Delete reminder
function deleteReminder(id) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        ReminderManager.deleteReminder(id);
        UIManager.showToast('Reminder deleted', 'success');
        renderReminders();
    }
}

// Toggle reminder completion
function toggleReminder(id) {
    ReminderManager.toggleReminder(id);
    UIManager.showToast('Reminder marked as taken!', 'success');
    renderReminders();
}

// Clear all reminders
function clearAllReminders() {
    if (confirm('Are you sure you want to delete ALL reminders? This cannot be undone.')) {
        ReminderManager.clearAll();
        UIManager.showToast('All reminders cleared', 'success');
        renderReminders();
    }
}

// Modal functionality
function openEditModal(id) {
    const reminders = ReminderManager.getAllReminders();
    const reminder = reminders.find(r => r.id === id);
    
    if (!reminder) return;

    document.getElementById('editId').value = id;
    document.getElementById('editMedicine').value = reminder.medicine;
    document.getElementById('editDosage').value = reminder.dosage;
    document.getElementById('editTime').value = reminder.time;

    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle edit form submission
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('editId').value);
            const medicine = document.getElementById('editMedicine').value;
            const dosage = document.getElementById('editDosage').value;
            const time = document.getElementById('editTime').value;

            ReminderManager.updateReminder(id, { medicine, dosage, time });
            UIManager.showToast('Reminder updated successfully!', 'success');
            closeEditModal();
            renderReminders();
        });
    }

    // Modal close button
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = closeEditModal;
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            closeEditModal();
        }
    };

    // Initial render
    renderReminders();
});

// Export reminders as JSON
function exportReminders() {
    const reminders = ReminderManager.getAllReminders();
    const dataStr = JSON.stringify(reminders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthlink-reminders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    UIManager.showToast('Reminders exported successfully!', 'success');
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function setupNotifications() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Check reminders every minute
    setInterval(checkReminders, 60000);
}

function checkReminders() {
    const reminders = ReminderManager.getAllReminders();
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');

    reminders.forEach(reminder => {
        if (reminder.time === currentTime && !reminder.completed) {
            sendNotification(reminder);
            // Send to backend for SMS/Email
            sendBackendAlert(reminder);
        }
    });
}

function sendNotification(reminder) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('💊 HealthLink AI - Medication Reminder', {
            body: `Time to take ${reminder.medicine} (${reminder.dosage})`,
            icon: '💊',
            tag: `reminder-${reminder.id}`,
            requireInteraction: true
        });

        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
}

// ============================================
// BACKEND INTEGRATION
// ============================================

async function sendBackendAlert(reminder) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
        const response = await fetch(`${apiUrl}/api/medication/send-alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                medicine: reminder.medicine,
                dosage: reminder.dosage,
                time: reminder.time,
                notes: reminder.notes
            })
        });

        if (response.ok) {
            console.log('Alert sent to backend successfully');
        }
    } catch (error) {
        console.error('Error sending alert to backend:', error);
    }
}

// ============================================
// SERVICE WORKER REGISTRATION (for offline support)
// ============================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}
