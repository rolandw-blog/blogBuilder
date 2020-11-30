import Styled from "styled-components";

const Fieldset = Styled.fieldset`
// margin: 2em;
// padding: 0.25em 0;
`;

const FormWrapper = Styled.div`
margin-top: 5em;
padding: 2em;
`;

const SubmitWrapper = Styled.div`
margin: 1.75em 0;
`;

const SourceRow = Styled.div`
display: grid;
grid-template-columns: 1fr auto auto;
& button {
	margin: 10px;
}
`;

// const IncrementDecrementButtonGroup = Styled.div`
// display: flex;
// flex-direction: row;
// // margin: 10px 0;
// // margin: 0 10px;
// // margin-left: 10px;
// // margin: 0 10px 0 10px;
// button {
// 	// margin: 0 10px 0 10px;
// 	// height: 50%;
// }
// // display: flex;
// // flex-direction: row;
// // justify-content: center;
// // flex-direction: column;
// // align-items: center;
// // button {
// // 	display: flex;
// // 	justify-content: center;
// // 	flex-direction: row;
// // 	margin: 0 5px;
// // 	height: 30px;
// // }
// `;

export { Fieldset, FormWrapper, SubmitWrapper, SourceRow };
