// script.js
document.addEventListener('DOMContentLoaded', () => {

    const taskForm = document.getElementById('task-form');
    const totalFteDisplay = document.getElementById('total-fte');
    const teamContainer = document.getElementById('team-container');
    const slider = document.getElementById('sliderWithValue');
    const progress = document.querySelector('progress'); // Reference to the progress element
    const levels = ["Junior", "Middle", "Senior"]; // Example levels

    // Fetch tasks from JSON file
    fetch('tasks.json')
    .then(response => response.json())
    .then(tasks => {
        // Dynamically generate the task checkboxes
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task has-tooltip-multiline has-tooltip-right';
            taskDiv.setAttribute('data-tooltip', `${task.description}`);

            const taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.id = `task-${index}`;
            taskCheckbox.className = "is-checkradio is-success is-circle";
            taskCheckbox.dataset.fte = task.fte;

            const taskLabel = document.createElement('label');
            taskLabel.htmlFor = `task-${index}`;
            taskLabel.textContent = `${task.name}`;

            taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild(taskLabel);
            taskForm.appendChild(taskDiv);

            taskCheckbox.addEventListener('change', updateTotalFte);
        });

        function updateTotalFte() {
            let totalFte = 0;
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const maxFte = parseFloat(slider.value);

            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    totalFte += parseFloat(checkbox.dataset.fte);
                }
            });
            totalFte = Math.round((totalFte + Number.EPSILON) * 100) / 100
            totalFteDisplay.textContent = `Total FTE required: ${totalFte}`;

            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.disabled = (totalFte + parseFloat(checkbox.dataset.fte)) > maxFte;
                }
            });
            if (totalFte > maxFte) {
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    checkbox.disabled = false;
                });
                totalFteDisplay.textContent = `Total FTE required: 0`;
            }
            // Update the progress element
            const fteUsedPercentage = ((totalFte / maxFte) * 100).toFixed(2);
            progress.value = fteUsedPercentage;
            progress.textContent = `${fteUsedPercentage}%`;
            // Update progress bar class based on percentage
            progress.classList.remove('is-warning', 'is-danger');
            if (fteUsedPercentage > 90) {
                progress.classList.add('is-danger');
            } else if (fteUsedPercentage > 75) {
                progress.classList.add('is-warning');
            }

        }
        // Initialize FTE display with the default slider value
        updateTotalFte();

        function updateTeamIcons(value) {
            teamContainer.innerHTML = ''; // Clear the container
            for (let i = 0; i < value; i++) {
                const teamMember = document.createElement('div');
                teamMember.className = 'team-member m-1';
                const iconSpan = document.createElement('span');
                iconSpan.className = 'icon is-large mb-1';
                const icon = document.createElement('i');
                icon.className = 'fas fa-3x fa-user';
                iconSpan.appendChild(icon);
                const selectWrapper = document.createElement('div');
                selectWrapper.className = 'select is-small';
                const select = document.createElement('select');
                levels.forEach(level => {
                    const option = document.createElement('option');
                    option.value = level;
                    option.textContent = level;
                    select.appendChild(option);
                });

                selectWrapper.appendChild(select);
                teamMember.appendChild(iconSpan);
                teamMember.appendChild(selectWrapper);
                teamContainer.appendChild(teamMember);
            }
        }

        slider.addEventListener('input', (event) => {
            const value = event.target.value;
            updateTeamIcons(value);

            updateTotalFte()
        });

        // Initialize with the default slider value
        updateTeamIcons(slider.value);
    })
    .catch(error => console.error('Error loading tasks:', error));
});