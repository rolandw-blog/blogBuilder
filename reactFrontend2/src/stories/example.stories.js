// YourComponent.stories.js

import React from "react";
import styled from "styled-components";
import PageEditField from "../components/pageEditField/PageEditField";

const Styles = styled.div`
	background: #282c34;
	font-size: calc(10px + 1.5vmin);
`;

// This default export determines where your story goes in the story list
export default {
	title: "PageEditField",
	component: PageEditField,
	decorators: [
		(Story) => (
			<>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css"
				></link>

				<Styles>
					<Story />
				</Styles>
			</>
		),
	],
};

const Template = (args) => <PageEditField {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
	noTitle: false,
	name: "URL",
	value: "example.com",
	fieldName: "url",
	_id: "5f36713524f4a368d7e2117c",
	color: "#282C34",
};
