'use client';

import {
  Box,
  Text,
  Image,
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
import { useRef, useState, useEffect, useCallback } from 'react';
import { Zone } from '@/entities/zone';
import { useUploadZoneImage, useDeleteZoneImage } from '@/hooks/zone';

type ZoneImageUploadProps = {
  zone: Zone;
  onImageChange?: (newImageUrl: string | null) => void;
  editable?: boolean;
};

export const ZoneImageUpload = ({ zone, onImageChange, editable = false }: ZoneImageUploadProps) => {
  const [uploadProps, setUploadProps] = useState<{ id: number; file: File } | undefined>();
  const [deleteImageId, setDeleteImageId] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState<string | null>(zone.imageUrl || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const { data: uploadData, isLoading: isUploading, error: uploadError } = useUploadZoneImage(uploadProps);
  const { data: deleteData, isLoading: isDeleting, error: deleteError } = useDeleteZoneImage(deleteImageId);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.700');
  const placeholderBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    setImageUrl(zone.imageUrl || null);
  }, [zone.imageUrl]);

  useEffect(() => {
    if (uploadData) {
      // uploadData is now the image URL string directly
      const newImageUrl = uploadData;

      // Force image refresh by adding timestamp to avoid browser cache
      const timestampedUrl = `${newImageUrl}?t=${Date.now()}`;

      // Update local state first with timestamped URL
      setImageUrl(timestampedUrl);
      setPreviewUrl(null);
      setUploadProps(undefined);

      // Call parent with the original URL (without timestamp)
      setTimeout(() => {
        onImageChange?.(newImageUrl);
      }, 0);

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha subido correctamente',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [uploadData, toast]); // Removed onImageChange from dependencies

  useEffect(() => {
    if (deleteData) {
      // deleteData is true when deletion succeeds
      // Update local state first
      setImageUrl(null);
      setPreviewUrl(null);
      setDeleteImageId(undefined);

      // Use setTimeout to ensure state updates are applied before calling parent
      setTimeout(() => {
        onImageChange?.(null);
      }, 0);

      toast({
        title: 'Imagen eliminada',
        description: 'La imagen se ha eliminado correctamente',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [deleteData, toast]); // Removed onImageChange from dependencies

  useEffect(() => {
    if (uploadError) {
      toast({
        title: 'Error al subir imagen',
        description: uploadError,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setUploadProps(undefined);
      setPreviewUrl(null);
    }
  }, [uploadError, toast]);

  useEffect(() => {
    if (deleteError) {
      toast({
        title: 'Error al eliminar imagen',
        description: deleteError,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setDeleteImageId(undefined);
    }
  }, [deleteError, toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 8 * 1024 * 1024;
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

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploadProps({ id: zone.id, file });
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = useCallback(
    (event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      setDeleteImageId(zone.id);
    },
    [zone.id],
  );

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
            onClick={handleDeleteImage}
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
        cursor={editable ? 'pointer' : 'default'}
        onClick={editable ? openFileSelector : undefined}
        _hover={editable ? { borderColor: 'blue.300' } : undefined}
        transition="border-color 0.2s"
        mx="auto"
      >
        {hasImage ? (
          <>
            <Image
              src={currentDisplayUrl}
              alt="Imagen de la zona"
              width="100%"
              objectFit="cover"
              opacity={previewUrl ? 0.8 : 1}
              filter={previewUrl ? 'blur(1px)' : 'none'}
              transition="all 0.3s"
            />

            {previewUrl && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.800"
                display="flex"
                alignItems="center"
                justifyContent="center"
                backdropFilter="blur(2px)"
              >
                <VStack spacing="3" color="white">
                  <Spinner size="lg" thickness="3px" speed="0.8s" />
                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                    Subiendo nueva imagen...
                  </Text>
                </VStack>
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
                  <VStack color="white" spacing="3">
                    <Spinner size="lg" thickness="3px" speed="0.8s" />
                    <Text fontSize="sm" fontWeight="medium">
                      {isUploading ? 'Subiendo...' : 'Eliminando...'}
                    </Text>
                  </VStack>
                ) : (
                  <VStack color="white" spacing="2">
                    <Icon as={FiUpload} boxSize="2rem" />
                    <Text fontSize="sm" textAlign="center" fontWeight="medium">
                      Click para cambiar imagen
                    </Text>
                  </VStack>
                )}
              </Box>
            )}
          </>
        ) : (
          <Center height="18rem" bg={placeholderBg} flexDirection="column" color={placeholderColor}>
            {isLoading ? (
              <VStack spacing="3">
                <Spinner size="lg" thickness="3px" speed="0.8s" color="blue.400" />
                <Text fontSize="sm" fontWeight="medium">
                  {isUploading ? 'Subiendo imagen...' : 'Eliminando imagen...'}
                </Text>
              </VStack>
            ) : editable ? (
              <VStack spacing="3">
                <Icon as={FiImage} boxSize="3rem" />
                <VStack spacing="1">
                  <Text fontSize="md" fontWeight="medium">
                    Click para seleccionar imagen
                  </Text>
                  <Text fontSize="sm">JPG, PNG o WebP • Máximo 8MB</Text>
                </VStack>
              </VStack>
            ) : (
              <VStack spacing="2">
                <Icon as={FiImage} boxSize="2rem" />
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