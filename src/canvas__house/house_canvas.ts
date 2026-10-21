function draw()
{
    let ctx = (document.getElementById("house_canvas") as HTMLCanvasElement).getContext("2d")!

    // Roof
    ctx.beginPath()
    ctx.moveTo(400, 100)
    ctx.lineTo(100, 250)
    ctx.lineTo(700, 250)
    ctx.closePath()
    ctx.fillStyle = "#773328"
    ctx.fill()

    // Chimney
    ctx.beginPath()
    ctx.moveTo(500, 150)
    ctx.lineTo(550, 175)
    ctx.lineTo(550, 125)
    ctx.lineTo(500, 125)
    ctx.closePath()
    ctx.fillStyle = "#a3a3a2"
    ctx.fill()

    // Smokes
    ctx.beginPath()
    ctx.arc(540, 90, 20, 0, Math.PI * 2)
    ctx.moveTo(0, 0) // pu (pen up)
    ctx.arc(575, 60, 15, 0, Math.PI * 2)
    ctx.moveTo(0, 0) // pu
    ctx.arc(610, 40, 10, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = "#eae5e3"
    ctx.fill()

    // Front wall
    ctx.beginPath()
    ctx.rect(200, 250, 400, 350)
    ctx.closePath()
    ctx.fillStyle = "#efcd9a"
    ctx.fill()

    function drawWindow(center_x: number, center_y: number, radius: number)
    {
        ctx.save()

        // Background
        let length = radius * 2
        ctx.beginPath()
        ctx.rect(center_x - radius, center_y - radius, length, length)
        ctx.closePath()
        ctx.fillStyle = "#c7b370"
        ctx.fill()

        // Four small glass (10% ~ 40%, 60% ~ 90%).
        let x_per_10 = center_x - radius + length * 0.1
        let y_per_10 = center_y - radius + length * 0.1
        let x_per_55 = center_x - radius + length * 0.55
        let y_per_55 = center_y - radius + length * 0.55
        let window_length = length * 0.35
        ctx.beginPath()
        ctx.rect(x_per_10, y_per_10, window_length, window_length) // left-upper
        ctx.moveTo(0, 0) // pu
        ctx.rect(x_per_55, y_per_10, window_length, window_length) // right-upper
        ctx.moveTo(0, 0) // pu
        ctx.rect(x_per_10, y_per_55, window_length, window_length) // left-lower
        ctx.moveTo(0, 0) // pu
        ctx.rect(x_per_55, y_per_55, window_length, window_length) // right-lower
        ctx.closePath()
        ctx.fillStyle = "#eaf4fc"
        ctx.fill()

        ctx.restore()
    }

    // Door
    ctx.beginPath()
    ctx.rect(450, 400, 100, 200) // background
    ctx.closePath()
    ctx.fillStyle = "#715c1f"
    ctx.fill()
    ctx.beginPath()
    ctx.arc(530, 510, 10, 0, Math.PI * 2) // nob
    ctx.closePath()
    ctx.fillStyle = "#b7282e"
    ctx.fill()
    drawWindow(500, 450, 30)

    // Window
    drawWindow(300, 400, 60)
}