// user.repository.jest.test.js
const { generateJson } = require('json-generator');

const UserModel = require('./user.model');
const UserRepository = require('./user.repository');

jest.createMockFromModule('./user.model');

describe('[jest] testing user repository', () => {
    describe('find()', () => {
        let findBuilderMock;

        beforeEach(() => {
            findBuilderMock = {
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn(),
            };
            UserModel.find = jest.fn().mockReturnValue(findBuilderMock);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        const { usersMock } = generateJson({
            usersMock: [5, { name: 'fullName', age: 'int;18;60', job: 'random;["engineer", "developer", "teacher"]' }],
        });

        const queryMock = {
            filter: { age: { $gte: 20 } },
            limit: 10,
            skip: 5,
            sort: { created_at: -1 },
            select: { _id: 0, name: 1, age: 1, job: 1, created_at: 0, updated_at: 0 },
        };

        it('should return a list of users if query succeeds', async () => {
            findBuilderMock.exec.mockResolvedValueOnce(usersMock);

            const result = await UserRepository.find(queryMock);
            expect(result).toHaveLength(usersMock.length);
            expect(result).toEqual(usersMock);
        });
        it('should return a list of users if query fails', async () => {
            const errMock = new Error('find error');
            findBuilderMock.exec.mockRejectedValueOnce(errMock);

            try {
                await UserRepository.find(queryMock);
            } catch (err) {
                expect(err).toEqual(errMock);
            }
        });
        it('should call the builder method correctly', async () => {
            findBuilderMock.exec.mockResolvedValueOnce(usersMock);

            await UserRepository.find(queryMock);

            expect(UserModel.find).toHaveBeenCalledWith(queryMock.filter);
            expect(findBuilderMock.limit).toHaveBeenCalledWith(queryMock.limit);
            expect(findBuilderMock.skip).toHaveBeenCalledWith(queryMock.skip);
            expect(findBuilderMock.sort).toHaveBeenCalledWith(queryMock.sort);
            expect(findBuilderMock.select).toHaveBeenCalledWith(queryMock.select);
            expect(findBuilderMock.exec).toHaveBeenCalled();
        });
    });
});

