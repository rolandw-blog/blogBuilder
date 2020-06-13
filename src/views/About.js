const listFilesInDirPartial = require('../../templates/partials/listFilesInDirPartial')

const page = `
<div class='imageAndTextWrapper'>
	<aside>
		<a href="/Resume">View my resume.</a>
        <p>
            I am a Computer enthusiast writing software and building things.
        </p>
        <br />
        <p>
            My interests are hacking, automation, and talking about software design philosophy. 
            My career goal is to work in devops / system administration by day and hack computers by night.
        </p>
        <br />
        <p>
            I am studying a BA of Computer Science in cybersecurity and network design at a university in Melbourne Australia.
        </p>
    </aside>
    <svg class='avatar'/>
</div>
`;

module.exports = {
	page: page,
	target: null,
	template: null
};
