'use client';

import {
  Box,
  Text,
  Image,
  Button,
  Input,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  useToast,
  Spinner,
  Center,
  Icon,
} from '@chakra-ui/react';
import { FiUpload, FiTrash2, FiImage } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';

type ImageUploadProps = {
  entityType: string;
  entityId: number;
  currentImageUrl?: string | null;
  onImageChange?: (newImageUrl: string | null) => void;
  editable?: boolean;
};

export const ImageUpload = ({
  entityType,
  entityId,
  currentImageUrl,
  onImageChange,
  editable = false,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.700');
  const placeholderBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    setImageUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Images/${entityType}/${entityId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error al subir imagen');
      }

      const result = await response.json();
      const newImageUrl = result.imageUrl;

      setImageUrl(newImageUrl);
      setPreviewUrl(null);
      onImageChange?.(newImageUrl);

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha subido correctamente',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error al subir imagen',
        description: error.message || 'Error desconocido',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Images/${entityType}/${entityId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error al eliminar imagen');
      }

      setImageUrl(null);
      setPreviewUrl(null);
      onImageChange?.(null);

      toast({
        title: 'Imagen eliminada',
        description: 'La imagen se ha eliminado correctamente',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error al eliminar imagen',
        description: error.message || 'Error desconocido',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones
    const maxSize = 8 * 1024 * 1024; // 8MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo debe ser menor a 8MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten archivos JPG, PNG y WebP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Mostrar preview inmediatamente mientras se sube
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    uploadImage(file);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const currentDisplayUrl = previewUrl || imageUrl;
  const hasImage = !!currentDisplayUrl;
  const isLoading = isUploading || isDeleting;

  return (
    <Box w="100%">
      <HStack justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Text>Imagen</Text>
        {editable && hasImage && (
          <IconButton
            aria-label="Eliminar imagen"
            icon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={deleteImage}
            isLoading={isDeleting}
            isDisabled={isLoading}
          />
        )}
      </HStack>

      <Box
        position="relative"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
        width="100%"
        minH="200px"
        cursor={editable ? 'pointer' : 'default'}
        onClick={editable ? openFileSelector : undefined}
        _hover={editable ? { borderColor: 'blue.300' } : undefined}
        transition="border-color 0.2s"
      >
        {hasImage ? (
          <>
            <Image
              src={currentDisplayUrl}
              alt="Imagen de la zona"
              width="100%"
              height="200px"
              objectFit="cover"
              opacity={previewUrl ? 0.8 : 1}
              filter={previewUrl ? 'blur(1px)' : 'none'}
              transition="all 0.3s"
            />

            {previewUrl && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="blackAlpha.700"
                px="3"
                py="2"
                borderRadius="md"
                color="white"
                fontSize="sm"
                fontWeight="medium"
              >
                Subiendo nueva imagen...
              </Box>
            )}

            {editable && !previewUrl && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg={overlayBg}
                opacity="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="opacity 0.2s"
                _hover={{ opacity: 1 }}
              >
                {isLoading ? (
                  <VStack color="white">
                    <Spinner size="lg" />
                    <Text fontSize="sm">{isUploading ? 'Subiendo...' : 'Eliminando...'}</Text>
                  </VStack>
                ) : (
                  <VStack color="white" spacing="2">
                    <Icon as={FiUpload} boxSize="2rem" />
                    <Text fontSize="sm" textAlign="center">
                      Click para cambiar imagen
                    </Text>
                  </VStack>
                )}
              </Box>
            )}
          </>
        ) : (
          <Center height="200px" bg={placeholderBg} flexDirection="column" color={placeholderColor}>
            {isLoading ? (
              <VStack>
                <Spinner size="lg" />
                <Text fontSize="sm">Subiendo imagen...</Text>
              </VStack>
            ) : editable ? (
              <VStack spacing="3">
                <FiImage size="3rem" />
                <VStack spacing="1">
                  <Text fontSize="md" fontWeight="medium">
                    Click para seleccionar imagen
                  </Text>
                  <Text fontSize="sm">JPG, PNG o WebP • Máximo 8MB</Text>
                </VStack>
              </VStack>
            ) : (
              <VStack spacing="2">
                <Icon as={FiUpload} boxSize="2rem" />
                <Text fontSize="sm">Sin imagen</Text>
              </VStack>
            )}
          </Center>
        )}
      </Box>

      {editable && (
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          display="none"
        />
      )}
    </Box>
  );
};
