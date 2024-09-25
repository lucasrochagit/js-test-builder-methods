// user.repository.mocha.test.js
const sinon = require('sinon');
const { generateJson } = require('json-generator');
const { expect } = require('chai');

const UserModel = require('./user.model');
const UserRepository = require('./user.repository');

describe('[mocha] testing user repository', () => {
    context('find()', () => {
        let findBuilderMock;

        beforeEach(() => {
            findBuilderMock = {
                limit: sinon.stub().returnsThis(),
                skip: sinon.stub().returnsThis(),
                sort: sinon.stub().returnsThis(),
                select: sinon.stub().returnsThis(),
                exec: sinon.stub(),
            };
            sinon.stub(UserModel, 'find').returns(findBuilderMock);
        });

        afterEach(() => {
            sinon.restore();
        });

        // mocks generated using the lib 'json-generator'
        const { usersMock } = generateJson({
            usersMock: [5, { name: 'fullName', age: 'int;18;60', job: 'random;["engineer", "developer", "teacher"]' }],
        });

        // mock from db query used on tests
        const queryMock = {
            filter: { age: { $gte: 20 } },
            limit: 10,
            skip: 5,
            sort: { created_at: -1 },
            select: { _id: 0, name: 1, age: 1, job: 1, created_at: 0, updated_at: 0 },
        };

        it('should return a list of users if query succeeds', async () => {
            findBuilderMock.exec.resolves(usersMock);

            const result = await UserRepository.find(queryMock);
            expect(result).to.have.length(usersMock.length);
            expect(result).to.equal(usersMock);
        });
        it('should return a list of users if query fails', async () => {
            const errMock = new Error('find error');
            findBuilderMock.exec.rejects(errMock);

            try {
                await UserRepository.find(queryMock);
            } catch (err) {
                expect(err).to.equal(errMock);
            }
        });
        it('should call the builder method correctly', async () => {
            findBuilderMock.exec.resolves(usersMock);

            await UserRepository.find(queryMock);

            sinon.assert.calledWith(UserModel.find, queryMock.filter);
            sinon.assert.calledWith(findBuilderMock.limit, queryMock.limit);
            sinon.assert.calledWith(findBuilderMock.skip, queryMock.skip);
            sinon.assert.calledWith(findBuilderMock.sort, queryMock.sort);
            sinon.assert.calledWith(findBuilderMock.select, queryMock.select);
            sinon.assert.called(findBuilderMock.exec);
        });
    });
});
