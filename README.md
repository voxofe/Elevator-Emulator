# Elevator movement algorithm (might change later):

1. When a floor request is made on an empty queue, it becomes the target floor.

2. The elevator moves toward the target floor, either up or down.

3. As the elevator moves in the direction of the target floor, it serves any floors in between (i.e., if the elevator is going from floor 2 to floor 5 and there's a request at floor 3, it will stop at floor 3 before continuing to floor 5).

4. If the elevator stop at a floor, that floor is removed from the queue.

5. When the elevator reaches the target floor, the target floor is removed from the queue.

6. If queue is not empty, the oldest request becomes the new target floor (go to 2), else it stops (go to 1).

The process repeats, always moving in the direction of the target floor and serving intermediate stops.
