import { useToast } from '@chakra-ui/react';

type UnifiedError = {
  field?: string;
  error: string;
};

export const useAppToast = () => {
  const toast = useToast();

  const showError = (error: UnifiedError) => {
    const title = error.field
      ? `Error en el campo ${error.field}`
      : 'Error inesperado';

    toast({
      title,
      description: error.error,
      status: 'error',
      duration: 4000,
      isClosable: true,
    });
  };

  const showSuccess = (message: string) => {
    toast({
      title: message,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  return { showError, showSuccess };
};
