import { Box, HStack, useColorModeValue } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

type QualificationSelectorProps = {
  value: string; // "3/5" format
  onChange: (value: string) => void;
  size?: string;
  spacing?: string;
};

export const QualificationSelector = ({
  value,
  onChange,
  size = '2.5rem',
  spacing = '1.5rem',
}: QualificationSelectorProps) => {
  const currentRating = value ? parseInt(value.split('/')[0]) : 0;

  const handleStarClick = (rating: number) => {
    onChange(`${rating}/5`);
  };

  return (
    <Box w="100%">
      <HStack spacing={spacing} justify="center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.1)' }}
            onClick={() => handleStarClick(star)}
          >
            <FaStar
              size={size}
              color={star <= currentRating ? '#FFD700' : '#E2E8F0'}
              style={{
                filter: star <= currentRating ? 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' : 'none',
              }}
            />
          </Box>
        ))}
      </HStack>
    </Box>
  );
};
