<h1><span class="grey">&#60;</span> Notes <span class="grey">/></span> </h1>
<p>
    Created using: <span class="orange">HTML/CSS</span>, <span class="orange">Angular</span>,
     <span class="orange">TypeScript</span>, <span class="orange">Firebase</span>
</p>
<p>
    <span class="grey">dot</span>Canvas is an <a href="https://www.reddit.com/r/place/">r/place</a> inspired app. The idea is to 
    provide users with a canvas and let them place pixels on it. Anyone connected will be able to
    see the pixels being placed live, which gives the site a 'lively' feel when populated.</p>
<p>
<p>
    Even though the project does not aim to solve a particular business problem, nor is it particularly entertaining
    without a user base interacting with it, it served as a good template project. For once, it helped me learn more about 
    <span class="orange">Typescript</span>, <span class="orange">Angular</span> and <span class="orange">Firebase</span>,
    incorporating it all into a full-stack application. Moreover, it also gave me a lot of insight into how to think about
    the page structure and new ways to interact with it.
</p>


<h1><span class="grey">></span> Project Structure</h1>

![project_flow](https://user-images.githubusercontent.com/100313927/180473861-f54a2217-48d6-40a4-a5e7-5bb903cd0d6b.png)

<h1><span class="grey">></span> Challenges</h1>
<p>
    Since I'm using <span class="orange">Firebase</span> to handle the backend, - plus not having to worry about scalability issues -
    most of the implementation challenges are front-end related. In particular, the issues that emmerge when changing the
    scale of the canvas, while keeping track of where the tiles must be placed.
</p>
<h2>Scaling the canvas</h2>

![scaling](https://user-images.githubusercontent.com/100313927/180474015-50f5378b-a89a-4901-bb32-6c4915f87e11.png)

<br>
<br>
<p>
    The first thing to do is to scale the canvas, so that the users can see which pixels are being painted. To do so, the canvas is wrapped
    by a div, and the 'transform: scale' is applied to it.
</p>
<p>
    I found this solution in <a href="https://www.redditinc.com/blog/how-we-built-rplace/">this</a> post, where one of the devs of r/place
    talks about how the sub was created. It's a much better solution than my first thought, which was to redraw a bigger canvas. Glad I've
    found the post! 
</p>

<h2>Positioning the view</h2>

![positioning](https://user-images.githubusercontent.com/100313927/180474076-5bd7aa13-69b7-4860-b76a-dd881683977a.png)

<br>
<br>
<p>
    After learning how to scale the canvas, the next step was to position the scaled canvas at the clicked pixel.
</p>
<p>
    I was struggling with it in the beginning, because, after scaling, it was hard to know by how much I had to offset the canvas
    in order to keep the clicked pixel at the center of the screen. 
</p>
<p>
    The solution I found was to set <span class="spec">TransformOrigin</span> to a corner (in this case 'top left'). This puts
    the scaled canvas at (0,0) of the viewport. Then,  I just had to offset the canvas by half of the clients' width/height 
    plus the value of the scaled coordinates. 
</p>

<h2>Aligning the Draw Guide</h2>

![align1](https://user-images.githubusercontent.com/100313927/180474181-4d2a5281-e8ad-4ade-a834-70926c2c2c1a.png)

<br>
<br>
<p>
    The Draw Guide was probably the hardest part of the project, because it must always stay centered relative to the view. 
    Plus, it must stay in sync with the correct pixels that will be painted. 
</p>
<p>
    To do so, I divided the canvas into squares with sides equal to the size of the scale. Then, I search for the closest intersection
    relative to the clicked coordinate and defined that as the origin of the drawing guide.
</p>

![align_mid](https://user-images.githubusercontent.com/100313927/180474276-c70ec11a-faa3-479b-9d41-25369b880840.png)

![find_intersection](https://user-images.githubusercontent.com/100313927/180474321-4b00cce9-edda-4915-a151-c681adcace5b.png)

<p>
    Finally, I offset the position by half of the selected brush size times the scale.
</p>

![offset mid top](https://user-images.githubusercontent.com/100313927/180474405-e08e8e95-5838-4ef5-8b57-c1a77e49bbbc.png)

![set guide pos](https://user-images.githubusercontent.com/100313927/180474450-64b66333-b476-4faa-a991-19f3ff64c9a3.png)

<h1><span class="grey">></span> Endnotes</h1>
<p>
    I really enjoy working on this project. It began as a way for me to practice the async stuff, but I ended up learning a lot about
    many other aspects of web development and went beyond just the front end. Above all, it made me really motivated to keep going, while 
    inspiring new ideas for the next project. 
</p>
<p>
    Moving forwards, there are a lot of things that I need to improve on. First of all, I'm sure I'm not using the full capabilities and 
    the best practices of <span class="orange">Angular</span> (although I do feel like I improved a lot when compared to my first 
    project, Rank2Earn). Also, I'm probably not taking full advantage of the extra typing resources <span class="orange">Typescript 
    </span> provides. Lastly, my conception of the <span class="orange">Firebase</span> Realtime DB it's still pretty raw. It's
    so easy to implement, that I feel like I'm left with many gaps in my understanding.
</p>
<p>
    Overall, I'm glad I developed enough of this project, to the point where I at least feel the desire to showcase it to other people - 
    while learning important, employable skills. 
</p>
<h3>Todo:</h3>
<ul>
    <li>Write tests</li>
    <li>UI: prettify the size btn</li>
    <li>UX: sometimes, the click'n drag can feel 'laggy'</li>
    
</ul>