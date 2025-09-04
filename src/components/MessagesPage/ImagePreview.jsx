import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import { Box, Card, CardActions, CardHeader, CardMedia, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { secondaryElement } from "../../lib/colorsConst";
//превью сообщения с картинкой
const ImagePreview = ({ selectedFile, setSelectedFile }) => {
	return (
		<Box>
			<Card
				sx={{
					backgroundColor: secondaryElement,
					boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
				}}
			>
				<CardHeader
					sx={{
						padding: "8px 8px 8px 8px", // 16px отступ слева и справа
					}}
					action={
						<IconButton
							onClick={() => {
								setSelectedFile(null);
							}}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				/>
				<CardMedia
					sx={{
						padding: "0 16px  16px  16px ", // 16px отступ слева и справа
						objectFit: "contain", // чтобы изображение не растягивалось
					}}
					component="img"
					image={URL.createObjectURL(selectedFile)}
					alt="Превью"
				/>
			</Card>
		</Box>
	);
};

export default ImagePreview;
