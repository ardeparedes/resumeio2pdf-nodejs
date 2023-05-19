# resumeio2pdf-nodejs

`resumeio2pdf-nodejs` is a Node.js command-line tool that converts resumes from resume.io into PDF format.

## Installation

To use `resumeio2pdf-nodejs`, you need to have Node.js installed on your system. You can install it by visiting the official Node.js website: https://nodejs.org/

Once you have Node.js installed, you can install `resumeio2pdf-nodejs` globally using npm (Node Package Manager). Open a terminal or command prompt and run the following command:

```bash
npm install -g resumeio2pdf-nodejs
```

## Usage

To convert a resume from resume.io into PDF format, use the following command:

```bash
resumeio2pdf-nodejs [resume_url]
```

Replace `[resume_url]` with the URL of the resume from resume.io that you want to convert. The tool will generate a PDF file with the same name as the SecureID of the resume.

For example:

```bash
resumeio2pdf-nodejs https://resume.io/r/your_resume_secure_id
```

The PDF file will be saved in the current directory with the name `[your_resume_secure_id]`.pdf.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

This tool is built using the following libraries and APIs:

- Node.js (https://nodejs.org/)
- PDFKit (https://pdfkit.org/)

## Contributing

Contributions to `resumeio2pdf-nodejs` are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request on the [GitHub repository](https://github.com/ardeparedes/resumeio2pdf-nodejs).

## Feedback

If you have any feedback, questions, or suggestions, please feel free to reach out to me.

---

Have fun converting your resume into PDF format with `resumeio2pdf-nodejs`!
