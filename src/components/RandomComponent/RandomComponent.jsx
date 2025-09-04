import { Box, Button, Typography } from "@mui/material";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import { mainButton, secondaryText2 } from "../../lib/colorsConst";

const RandomComponent = ({ content }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center", // Центрирование по вертикали
				alignItems: "center", // Центрирование по горизонтали (если нужно)
				height: "70vh", // Высота экрана
			}}
		>
			<Typography variant="H2" sx={{ mt: 2, color: secondaryText2 }}>
				{content}
			</Typography>
			<Button variant="contained" sx={{ mt: 2, backgroundColor: mainButton, color: secondaryText2 }}>
				ok
			</Button>
		</Box>
	);
};

export default RandomComponent;
